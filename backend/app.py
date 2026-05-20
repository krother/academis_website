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
    email: str = "-"
    message: str
    privacy: bool
    course: str = "-"

    @classmethod
    def as_form(
        cls,
        name: Annotated[str, Form()],
        message: Annotated[str, Form()],
        privacy: Annotated[bool, Form()],
        email: Annotated[str, Form()] = "-",
        course: Annotated[str, Form()] = "-",
    ) -> "ContactForm":
        return cls(name=name, email=email, message=message, privacy=privacy, course=course)

@app.post("/contact")
def send_message(form: ContactForm = Depends(ContactForm.as_form)):
    subject = f"Academis: new message from {form.name}"
    msg = "\n\n".join((
        "e-mail:" + form.email, 
        "course:" + form.course,
        form.message
    ))
    send_email(to_email="kristian.rother@posteo.de", subject=subject, body=msg)
    return RedirectResponse(url="/", status_code=303)
