"""
Report Generator Service
Generates ReportLab PDF documents and structured CSV exports.
Calculates revenue based on actual recorded payments.
"""

import io
import csv
from reportlab.lib.pagesizes import letter, landscape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from database.db_connection import db

class ReportGenerator:
    @staticmethod
    def export_csv(report_type, start_date=None, end_date=None):
        output = io.StringIO()
        writer = csv.writer(output)

        with db.get_cursor() as cursor:
            if report_type == 'all_repairs':
                cursor.execute("""
                    SELECT r.job_code, c.full_name, CONCAT(d.brand, ' ', d.model), 
                           r.repair_status, r.assigned_technician, r.labor_cost, r.parts_cost, r.total_repair_cost
                    FROM repair_jobs r
                    JOIN customers c ON r.customer_id = c.id
                    JOIN devices d ON r.device_id = d.id;
                """)
                writer.writerow(['Job Code', 'Customer', 'Device', 'Status', 'Technician', 'Labor (PHP)', 'Parts (PHP)', 'Total (PHP)'])
                for row in cursor.fetchall():
                    writer.writerow(list(row.values()))

            elif report_type == 'payments_received':
                cursor.execute("""
                    SELECT p.payment_code, p.payment_date, c.full_name, p.payment_method, 
                           p.amount_paid, p.remaining_balance, p.transaction_reference
                    FROM payments p
                    JOIN customers c ON p.customer_id = c.id
                    WHERE p.amount_paid > 0;
                """)
                writer.writerow(['Payment Code', 'Date', 'Customer', 'Method', 'Amount (PHP)', 'Balance (PHP)', 'Reference'])
                for row in cursor.fetchall():
                    writer.writerow(list(row.values()))

        output.seek(0)
        return output.getvalue()

    @staticmethod
    def generate_pdf(report_title, table_data, headers):
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=landscape(letter), rightMargin=30, leftMargin=30, topMargin=30, bottomMargin=30)
        elements = []
        styles = getSampleStyleSheet()

        elements.append(Paragraph(f"<b>TechPulse Computer Repair Shop - {report_title}</b>", styles['Title']))
        elements.append(Spacer(1, 15))

        data = [headers] + table_data
        t = Table(data)
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0f172a')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 9),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 6),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ]))
        elements.append(t)
        doc.build(elements)
        buffer.seek(0)
        return buffer.getvalue()
