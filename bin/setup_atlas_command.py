import configparser
import csv
import logging
import logging.handlers
import os
import sys

ATLAS_ROW = {
    "security_framework": "mitre_atlas",
    "security_framework_label": "MITRE ATLAS",
    "security_framework_color": "#3B6EA5",
    "security_framework_transform": "atlas_tt_lookup",
    "security_framework_transform_key": "technique_id",
    "security_framework_transform_label": "technique_id",
}

LOG_MAX_BYTES = 5 * 1024 * 1024  # 5 MB
LOG_BACKUP_COUNT = 3


def get_logger(splunk_home):
    app_dir = os.path.join(splunk_home, "etc", "apps", "DA-ESS-MitreContent")
    log_dir = os.path.join(app_dir, "logs")
    os.makedirs(log_dir, exist_ok=True)
    log_path = os.path.join(log_dir, "setup_atlas_command.log")

    logger = logging.getLogger("setup_atlas_command")
    if logger.handlers:
        return logger

    handler = logging.handlers.RotatingFileHandler(
        log_path, maxBytes=LOG_MAX_BYTES, backupCount=LOG_BACKUP_COUNT, encoding="utf-8"
    )
    handler.setFormatter(logging.Formatter("%(asctime)s %(levelname)s %(message)s"))
    logger.addHandler(handler)
    logger.setLevel(logging.DEBUG)
    return logger


def get_security_framework_filename(splunk_home, logger):
    sa_ti = os.path.join(splunk_home, "etc", "apps", "SA-ThreatIntelligence")
    # local/ overrides default/ in Splunk — check both, local first
    for conf_dir in ("local", "default"):
        conf_path = os.path.join(sa_ti, conf_dir, "transforms.conf")
        if not os.path.exists(conf_path):
            continue
        try:
            parser = configparser.RawConfigParser()
            parser.read(conf_path, encoding="utf-8")
            if parser.has_option("security_framework_lookup", "filename"):
                filename = parser.get("security_framework_lookup", "filename").strip()
                logger.info("security_framework_lookup filename resolved from %s: %s", conf_path, filename)
                return filename
        except Exception as e:
            logger.error("Failed to parse transforms.conf at %s: %s", conf_path, e)

    logger.error(
        "security_framework_lookup filename not found in transforms.conf under %s",
        sa_ti,
    )
    return None


def patch_csv():
    splunk_home = os.environ.get("SPLUNK_HOME")
    if not splunk_home:
        splunk_home = "/opt/splunk"
        # Logger can't be fully initialised yet — use a basic stderr fallback just for this warning
        logging.basicConfig()
        logging.warning("SPLUNK_HOME is not set; defaulting to %s", splunk_home)

    log_path = os.path.join(
        splunk_home, "etc", "apps", "DA-ESS-MitreContent", "logs", "setup_atlas_command.log"
    )
    log_hint = " Check logs: %s" % log_path

    logger = get_logger(splunk_home)
    logger.info("patch_csv started")

    try:
        csv_filename = get_security_framework_filename(splunk_home, logger)
        if csv_filename is None:
            msg = "security_framework_lookup filename could not be resolved from transforms.conf." + log_hint
            return "error", msg

        csv_path = os.path.join(
            splunk_home, "etc", "apps", "SA-ThreatIntelligence", "lookups", csv_filename
        )

        if not os.path.exists(csv_path):
            msg = "CSV not found: %s.%s" % (csv_path, log_hint)
            logger.error(msg)
            return "error", msg

        with open(csv_path, "r", newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            fieldnames = reader.fieldnames
            rows = [{field: row.get(field, "") for field in fieldnames} for row in reader]

        if any(r.get("security_framework") == "mitre_atlas" for r in rows):
            msg = "mitre_atlas already exists"
            logger.info(msg)
            return "already_present", msg

        atlas_row = {field: ATLAS_ROW.get(field, "") for field in fieldnames}
        new_rows = []
        inserted = False
        for row in rows:
            new_rows.append(row)
            if row.get("security_framework") == "mitre_attack":
                new_rows.append(atlas_row)
                inserted = True
        if not inserted:
            new_rows.append(atlas_row)

        with open(csv_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
            writer.writeheader()
            writer.writerows(new_rows)

        msg = "mitre_atlas added to %s" % csv_filename
        logger.info(msg)
        return "success", msg

    except Exception as e:
        logger.exception("Unexpected error in patch_csv: %s", e)
        return "error", "Unexpected error: %s.%s" % (e, log_hint)


def main():
    try:
        sys.stdin.read()
    except Exception:
        pass
    status, message = patch_csv()
    sys.stdout.write("status,message\n")
    sys.stdout.write('"%s","%s"\n' % (status, message))


if __name__ == "__main__":
    main()
