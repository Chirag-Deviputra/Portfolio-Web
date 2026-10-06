"""Portfolio website and validated SMTP contact endpoint."""
import os
import json
from pathlib import Path
import re
import smtplib
from datetime import datetime, timezone
from email.message import EmailMessage
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024
SENDER_EMAIL = os.getenv('SENDER_EMAIL', 'chiragdeviputra65@gmail.com')
SENDER_PASSWORD = os.getenv('SENDER_PASSWORD', '')
RECEIVER_EMAIL = os.getenv('RECEIVER_EMAIL', 'chiragdeviputra65@gmail.com')

@app.get('/')
def index():
    projects = json.loads((Path(__file__).parent / 'projects.json').read_text())
    return render_template('index.html', year=datetime.now(timezone.utc).year, projects=projects, project_details={p['id']: p for p in projects})

@app.get('/health')
def health():
    return jsonify(status='ok')

@app.errorhandler(413)
def too_large(_error):
    return jsonify(success=False, error='Message is too large.'), 413

@app.post('/send-message')
def send_message():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify(success=False, error='Please submit a valid contact form.'), 400
    limits = {'name': 100, 'email': 254, 'subject': 150, 'message': 5000, 'website': 200}
    fields = {}
    for key, limit in limits.items():
        value = data.get(key, '')
        if not isinstance(value, str) or len(value) > limit:
            return jsonify(success=False, error=f'Please check the {key} field.'), 400
        fields[key] = value.strip()
    if fields['website']:
        return jsonify(success=False, error='Unable to submit this form.'), 400
    if not all(fields[k] for k in ('name', 'email', 'message')):
        return jsonify(success=False, error='Please fill in all required fields.'), 400
    if any('\n' in fields[k] or '\r' in fields[k] for k in ('name', 'email', 'subject')):
        return jsonify(success=False, error='Please remove line breaks from the name, email and subject.'), 400
    if not re.fullmatch(r"[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?\.[A-Za-z]{2,63}", fields['email']):
        return jsonify(success=False, error='Please enter a valid email address.'), 400
    if not SENDER_PASSWORD:
        return jsonify(success=False, error='The contact form is not configured yet. Please email chiragdeviputra65@gmail.com directly.'), 503
    msg = EmailMessage()
    msg['Subject'] = f"Portfolio: {fields['subject'] or 'New message'} — {fields['name']}"
    msg['From'] = SENDER_EMAIL
    msg['To'] = RECEIVER_EMAIL
    msg['Reply-To'] = fields['email']
    msg.set_content(f"Name: {fields['name']}\nEmail: {fields['email']}\n\n{fields['message']}")
    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465, timeout=12) as server:
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.send_message(msg)
    except (smtplib.SMTPException, OSError):
        app.logger.warning('Contact email delivery failed.')
        return jsonify(success=False, error='Could not send your message. Please email me directly.'), 502
    return jsonify(success=True, message="Message sent! I'll get back to you soon.")

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=os.getenv('FLASK_DEBUG') == '1')
