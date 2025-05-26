#/bin/sh

echo "DEPLOYING ] ";

git subtree push --prefix web/result-minify origin static # > deploy.log 2>&1

if test $? -eq 0; then
  printf "OK\n";
else
  printf "FAILED\n";
fi
