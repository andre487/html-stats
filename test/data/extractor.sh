#!/usr/bin/env bash

dir="$(cd "$(dirname "$0")" && pwd)"

docs_count=50

for i in $(seq 1 "$docs_count"); do
    curl "https://yandex.ru/search/?text=cats" > "$dir/doc_$i.html"
done
