#!/bin/bash

closure-compiler \
 --js jquery.ajax.arraybuffer.js \
 --js_output_file jquery.ajax.arraybuffer.min.js \
 --externs closure-compiler/contrib/externs/jquery-1.12_and_2.2.js \
 --externs externs.js \
 --assume_function_wrapper \
 --compilation_level ADVANCED \
 --language_in ECMASCRIPT5_STRICT \
 --language_out ECMASCRIPT5_STRICT\
 --new_type_inf \
 --output_wrapper '(function(){%output%})()' \
 --summary_detail_level 3 \
 --use_types_for_optimization \
 --warning_level VERBOSE

