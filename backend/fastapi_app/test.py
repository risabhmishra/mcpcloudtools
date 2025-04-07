import shlex
import json


def curl_to_httpx_async(curl_cmd: str):
    tokens = shlex.split(curl_cmd)
    url, method, headers, data = '', 'GET', {}, None

    i = 0
    while i < len(tokens):
        token = tokens[i]
        if token == 'curl':
            i += 1
        elif token in ['--location', '--include', '--compressed', '--silent']:
            i += 1  # Ignored for conversion
        elif token in ['--request', '-X']:
            method = tokens[i + 1].upper()
            i += 2
        elif token.startswith('http'):
            url = token
            i += 1
        elif token in ['--url']:
            url = tokens[i + 1]
            i += 2
        elif token in ['-H', '--header']:
            header = tokens[i + 1]
            key, value = header.split(":", 1)
            headers[key.strip()] = value.strip()
            i += 2
        elif token in ['--data', '-d', '--data-raw', '--data-binary']:
            data = tokens[i + 1]
            i += 2
        elif token in ['--form', '-F']:
            # Handle --form data as multipart
            if data is None:
                data = {}
            form = tokens[i + 1]
            if '=' in form:
                key, value = form.split('=', 1)
                if value.startswith('@'):
                    data[key] = ('filename', open(value[1:], 'rb'))
                else:
                    data[key] = value
            i += 2
        else:
            i += 1

    try:
        if headers.get('Content-Type', '').startswith('application/json'):
            data = json.loads(data) if data else None
    except Exception:
        pass

    return {
        'method': method,
        'url': url,
        'headers': headers or None,
        'data': data
    }


# Example usage
print(curl_to_httpx_async("curl --location --request GET 'https://jsonplaceholder.typicode.com/posts/1'"))
print(curl_to_httpx_async("curl 'https://api.example.com' -H 'Content-Type: application/json' -d '{\"foo\": \"bar\"}'"))
print(curl_to_httpx_async("curl 'https://api.example.com/search?q=chatgpt&limit=10'"))
print(curl_to_httpx_async("""curl --location --request POST 'https://api.example.com/raw' \
  --header 'Content-Type: text/plain' \
  --data 'Just a plain text body.'
"""))
