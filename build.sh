rm -rf build
mkdir -p build
cp -r static build/static
uv run build.py
