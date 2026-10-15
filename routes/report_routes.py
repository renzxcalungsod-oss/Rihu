"""
Report Routes (Flask Blueprint)
Handles on-screen report rendering, CSV streaming, and PDF generation.
"""

from flask import Blueprint, render_template, request, Response
from flask_login import login_required
from services.report_service import ReportGenerator

report_bp = Blueprint('reports', __name__)

@report_bp.route('/')
@login_required
def index():
    report_type = request.args.get('type', 'all_repairs')
    return render_template('reports/index.html', report_type=report_type)

@report_bp.route('/export/csv')
@login_required
def export_csv():
    report_type = request.args.get('type', 'all_repairs')
    csv_data = ReportGenerator.export_csv(report_type)
    return Response(
        csv_data,
        mimetype="text/csv",
        headers={"Content-disposition": f"attachment; filename=report_{report_type}.csv"}
    )
