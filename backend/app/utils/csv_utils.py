import csv
import io
from typing import List, Dict, Any


def generate_csv(headers: List[str], rows: List[Dict[str, Any]]) -> str:
    """Generate CSV content from headers and rows."""
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=headers)
    writer.writeheader()

    for row in rows:
        filtered_row = {k: v for k, v in row.items() if k in headers}
        writer.writerow(filtered_row)

    return output.getvalue()


def escape_csv_value(value: Any) -> str:
    """Escape special characters in CSV values."""
    if value is None:
        return ""

    str_val = str(value)
    if "," in str_val or '"' in str_val or "\n" in str_val:
        return '"' + str_val.replace('"', '""') + '"'
    return str_val
