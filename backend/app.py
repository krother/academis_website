from typing import Annotated

from fastapi import FastAPI, Form, Depends
from fastapi.responses import RedirectResponse
from pydantic import BaseModel

from send_email import send_email

app = FastAPI()

@app.get("/")
def main():
    return "hello world"


class ContactForm(BaseModel):
    name: str
    email: str|None = None
    message: str
    privacy: bool

    @classmethod
    def as_form(
        cls,
        name: Annotated[str, Form()],
        message: Annotated[str, Form()],
        privacy: Annotated[bool, Form()],
        email: Annotated[str|None, Form()] = None,
    ) -> "ContactForm":
        return cls(name=name, email=email, message=message, privacy=privacy)

@app.post("/contact")
def send_message(form: ContactForm = Depends(ContactForm.as_form)):
    subject = f"Academis: new message from {form.name}"
    msg = (form.email or "") + "\n\n" + form.message
    send_email(to_email="kristian.rother@posteo.de", subject=subject, body=msg)
    return RedirectResponse(url="/", status_code=303)
