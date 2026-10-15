"""
Service Catalog Routes (Flask Blueprint)
"""

from flask import Blueprint, render_template
from flask_login import login_required
from models.service import Service

service_bp = Blueprint('services', __name__)

@service_bp.route('/')
@login_required
def index():
    services = Service.get_all()
    return render_template('services/index.html', services=services)
