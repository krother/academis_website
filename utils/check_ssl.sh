openssl s_client \
    -connect www.academis.eu:443 \
    -servername www.academis.eu \
    -showcerts \
    -verify_return_error \
    </dev/null
