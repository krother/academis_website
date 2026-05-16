import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from conf import SMTP_PASSWORD

SMTP_SERVER = "posteo.de"
SMTP_PORT = 465
SMTP_USER = "kristian.rother@posteo.de"


def send_email(to_email, subject, body):
    msg = MIMEMultipart()
    msg["From"] = "Myself <kristian.rother@posteo.de>"
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT) as server:
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.send_message(msg)

    print(f"Email erfolgreich an {to_email} gesendet!")


if __name__ == "__main__":
    send_email(
        "kristian.rother@posteo.de",
        "Testmail",
        "sent from Academis.eu with smtplib.",
    )
