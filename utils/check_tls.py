import ssl
import socket
import sys
import hashlib
from urllib.parse import urlparse
from datetime import datetime, timezone


def check_tls(url):
    parsed = urlparse(url if "://" in url else f"https://{url}")
    hostname = parsed.hostname
    port = parsed.port or 443

    if not hostname:
        print("ERROR: Invalid hostname")
        return

    print(f"\nChecking {hostname}:{port}")
    print("=" * 60)

    # Use the operating system's trusted CA certificates.
    context = ssl.create_default_context()
    context.minimum_version = ssl.TLSVersion.TLSv1_2

    try:
        with socket.create_connection(
            (hostname, port), timeout=10
        ) as sock:

            with context.wrap_socket(
                sock, server_hostname=hostname
            ) as conn:

                cert = conn.getpeercert()
                der_cert = conn.getpeercert(binary_form=True)

                print("\n[OK] Certificate verification successful")
                print(f"TLS version: {conn.version()}")
                print(f"Cipher:      {conn.cipher()[0]}")

                print("\nCertificate information:")
                print(f"Subject:     {cert['subject']}")
                print(f"Issuer:      {cert['issuer']}")
                print(f"Valid from:  {cert['notBefore']}")
                print(f"Valid until: {cert['notAfter']}")

                # Check expiration explicitly
                expiry = datetime.strptime(
                    cert["notAfter"], "%b %d %H:%M:%S %Y %Z"
                ).replace(tzinfo=timezone.utc)

                remaining = expiry - datetime.now(timezone.utc)

                print(f"Remaining:   {remaining.days} days")

                print("\nSHA256 fingerprint:")
                print(hashlib.sha256(der_cert).hexdigest())

                print("\nSubject Alternative Names:")
                for name_type, name in cert.get("subjectAltName", []):
                    print(f"  {name_type}: {name}")

    except ssl.SSLCertVerificationError as e:
        print("\n[FAILED] Certificate verification failed!")
        print(f"Reason: {e}")
        print(f"Verification code: {e.verify_code}")
        print(f"Verification message: {e.verify_message}")

    except ssl.SSLError as e:
        print(f"\n[FAILED] SSL error: {e}")

    except OSError as e:
        print(f"\n[FAILED] Connection error: {e}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python check_tls.py https://example.com")
        sys.exit(1)

    check_tls(sys.argv[1])

