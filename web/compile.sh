#!/bin/sh
# empty old result
rm -r result/*;
# run compile.php
php compile.php
# minify result
cd result;
rm shared/res
cp -r ../../res shared/res
minify --output=../result.minify --all --preserve=links -rs .;
