node_modules/jslint/bin/jslint --config jslint_config.json controllers/* lib/* routes/* >> jslint.out
cat jslint.out | grep "No problems"
