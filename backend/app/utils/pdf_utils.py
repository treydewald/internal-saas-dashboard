from io import BytesIO
from datetime import datetime
from typing import List, Dict, Any


def generate_pdf_content(title: str, headers: List[str], rows: List[Dict[str, Any]]) -> bytes:
    """
    Generate PDF content from title, headers, and rows.
    Returns PDF as bytes.

    Note: This is a simplified implementation.
    For production, use reportlab or fpdf2.
    """
    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.lib.styles import getSampleStyleSheet
        from reportlab.lib.units import inch
        from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
        from reportlab.lib import colors
        from reportlab.lib.enums import TA_CENTER

        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        elements = []

        styles = getSampleStyleSheet()
        title_style = styles["Heading1"]
        title_style.alignment = TA_CENTER

        title_para = Paragraph(title, title_style)
        elements.append(title_para)

        timestamp = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
        elements.append(Paragraph(f"<font size=10>Generated: {timestamp}</font>", styles["Normal"]))
        elements.append(Spacer(1, 0.3 * inch))

        table_data = [headers]
        for row in rows:
            row_data = [str(row.get(h, "")) for h in headers]
            table_data.append(row_data)

        table = Table(table_data)
        table.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0F172A")),
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
                    ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                    ("FONTSIZE", (0, 0), (-1, 0), 12),
                    ("BOTTOMPADDING", (0, 0), (-1, 0), 12),
                    ("BACKGROUND", (0, 1), (-1, -1), colors.HexColor("#F5F5F5")),
                    ("GRID", (0, 0), (-1, -1), 1, colors.grey),
                ]
            )
        )
        elements.append(table)

        doc.build(elements)
        return buffer.getvalue()

    except ImportError:
        raise ImportError("reportlab required for PDF generation. Install with: pip install reportlab")
