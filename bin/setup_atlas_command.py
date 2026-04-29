import csv
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


def patch_csv():
    splunk_home = os.environ.get("SPLUNK_HOME", "/opt/splunk")
    csv_path = os.path.join(
        splunk_home, "etc", "apps", "SA-ThreatIntelligence",
        "lookups", "security_framework_annotations3.csv"
    )

    if not os.path.exists(csv_path):
        return "error", "CSV not found: %s" % csv_path

    with open(csv_path, "r", newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        rows = [{field: row.get(field, "") for field in fieldnames} for row in reader]

    if any(r.get("security_framework") == "mitre_atlas" for r in rows):
        return "already_present", "mitre_atlas already exists"

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

    return "success", "mitre_atlas added to security_framework_annotations3.csv"


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
