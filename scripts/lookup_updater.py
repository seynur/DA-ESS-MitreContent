import argparse
from functools import reduce
from typing import Dict, List

import pandas as pd


CONFIG: Dict[str, Dict[str, List]] = {
    "attack": {
        "output_prefix": "mitre",
        "drop_indices": [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29],
        "tactic_ids": [
            "TA0043", "TA0042", "TA0001", "TA0002", "TA0003", "TA0004",
            "TA0005", "TA0112", "TA0006", "TA0007", "TA0008", "TA0009", "TA0011",
            "TA0010", "TA0040",
        ],
        "tactic_names": [
            "Reconnaissance", "Resource Development", "Initial Access",
            "Execution", "Persistence", "Privilege Escalation",
            "Stealth", "Defense Impairment", "Credential Access",
            "Discovery", "Lateral Movement", "Collection",
            "Command and Control", "Exfiltration", "Impact",
        ],
    },
    "atlas": {
        "output_prefix": "atlas",
        "drop_indices": [1, 3, 5, 8, 10, 13, 16, 18, 20, 22, 25, 27],
        "tactic_ids": [
            "AML.TA0002", "AML.TA0003", "AML.TA0004", "AML.TA0000",
            "AML.TA0005", "AML.TA0006", "AML.TA0012", "AML.TA0007",
            "AML.TA0013", "AML.TA0008", "AML.TA0015", "AML.TA0009",
            "AML.TA0001", "AML.TA0014", "AML.TA0010", "AML.TA0011",
        ],
        "tactic_names": [
            "Reconnaissance", "Resource Development", "Initial Access",
            "AI Model Access", "Execution", "Persistence",
            "Privilege Escalation", "Defense Evasion", "Credential Access",
            "Discovery", "Lateral Movement", "Collection",
            "AI Attack Staging", "Command and Control", "Exfiltration",
            "Impact",
        ],
    },
}


def write_lookup(layer_tech_id: str, output_prefix: str) -> None:
    """Read the technique ID sheet and export the base lookup CSV."""
    tech_id = pd.read_excel(layer_tech_id, engine="openpyxl")
    tech_id.to_csv(f"{output_prefix}_lookup.csv", index=False)



def normalize_paired_columns(df: pd.DataFrame) -> pd.DataFrame:
    """
    Flatten paired columns into a normalized DataFrame.

    The original input sheets store related values in adjacent columns.
    This function preserves the same pairing logic used in the original scripts.
    """
    normalized = pd.DataFrame()

    for column_index in range(df.shape[1]):
        values = []
        try:
            for row_index in range(df.shape[0]):
                left_value = df.iloc[row_index, column_index]
                right_value = df.iloc[row_index, column_index + 1]

                if pd.notnull(left_value):
                    values.append(left_value)
                    values.append(right_value)
                elif pd.isnull(left_value) and pd.notnull(right_value):
                    values.append(right_value)
        except IndexError:
            pass

        normalized = pd.concat(
            [normalized, pd.Series(values)], ignore_index=True, axis=1
        )

    return normalized



def write_subtechniques(layer_sub_id: str, config: Dict) -> pd.DataFrame:
    """Read the sub-technique sheet and export the sub-techniques lookup CSV."""
    sub_id = pd.read_excel(layer_sub_id, engine="openpyxl")
    sub = normalize_paired_columns(sub_id)

    sub = sub.drop(sub.columns[config["drop_indices"]], axis=1)
    sub.columns = config["tactic_ids"]
    sub = sub.apply(lambda column: pd.Series(column.dropna().values))
    sub.to_csv(f'{config["output_prefix"]}_lookup_subtechniques.csv', index=False)

    return sub



def write_tt_lookup(layer_only_names: str, sub: pd.DataFrame, config: Dict) -> None:
    """Read the names sheet and export the tactic-technique lookup CSV."""
    name_df = pd.read_excel(layer_only_names, engine="openpyxl")
    all_names = normalize_paired_columns(name_df)

    all_names = all_names.drop(all_names.columns[config["drop_indices"]], axis=1)
    all_names.columns = config["tactic_names"]
    all_names = all_names.apply(lambda column: pd.Series(column.dropna().values))

    tt = pd.DataFrame()

    tactic_id = []
    tactic_name = []
    technique_id = []
    technique_name = []

    for index in range(sub.shape[1]):
        tactic_id.append([config["tactic_ids"][index]] * len(sub.iloc[:, index]))
        tactic_name.append([config["tactic_names"][index]] * len(sub.iloc[:, index]))
        technique_id.append(list(sub.iloc[:, index]))
        technique_name.append(list(all_names.iloc[:, index]))

    tt["tactic_id"] = reduce(lambda left, right: left + right, tactic_id)
    tt["tactic_name"] = reduce(lambda left, right: left + right, tactic_name)
    tt["technique_id"] = reduce(lambda left, right: left + right, technique_id)
    tt["technique_name"] = reduce(lambda left, right: left + right, technique_name)

    tt = tt.dropna()
    tt.to_csv(f'{config["output_prefix"]}_tt_lookup.csv', index=False)



def parse_args() -> argparse.Namespace:
    example_text = """
Examples:
  python3 lookup_updater.py --mode attack -t layer_tech_id.xlsx -s layer_sub_id.xlsx -n layer_only_names.xlsx
  python3 lookup_updater.py --mode atlas  -t layer_tech_id.xlsx -s layer_sub_id.xlsx -n layer_only_names.xlsx

Output files:
  attack -> mitre_lookup.csv, mitre_lookup_subtechniques.csv, mitre_tt_lookup.csv
  atlas  -> atlas_lookup.csv, atlas_lookup_subtechniques.csv, atlas_tt_lookup.csv
"""

    parser = argparse.ArgumentParser(
        description="Generate ATT&CK or ATLAS lookup CSV files from Excel input files.",
        epilog=example_text,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "-m",
        "--mode",
        required=True,
        choices=["attack", "atlas"],
        help="Framework type to process.",
    )
    parser.add_argument(
        "-t",
        "--layer_tech_id",
        required=True,
        help="Excel file containing tactics and technique IDs.",
    )
    parser.add_argument(
        "-s",
        "--layer_sub_id",
        required=True,
        help="Excel file containing tactics, technique IDs, and sub-technique IDs.",
    )
    parser.add_argument(
        "-n",
        "--layer_only_names",
        required=True,
        help="Excel file containing tactic and technique names.",
    )

    return parser.parse_args()



def main() -> None:
    args = parse_args()
    config = CONFIG[args.mode]

    write_lookup(args.layer_tech_id, config["output_prefix"])
    sub = write_subtechniques(args.layer_sub_id, config)
    write_tt_lookup(args.layer_only_names, sub, config)

    print(f"Lookup files generated successfully for mode: {args.mode}")


if __name__ == "__main__":
    main()
