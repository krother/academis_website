#!/usr/bin/bash

mkdir -p content

git clone https://github.com/krother/Python3_Basics_Tutorial.git
git clone https://github.com/krother/python3_grundlagenkurs.git
git clone https://github.com/krother/Python3_Reference.git
git clone https://github.com/krother/Python3_Package_Examples.git
git clone https://github.com/krother/advanced_python.git
git clone https://github.com/krother/python_testing_tutorial.git
git clone https://github.com/krother/Biopython_Tutorial.git
git clone https://github.com/krother/training_and_teaching_methods.git
git clone https://github.com/krother/speech_projects.git

mv content/Python3_Basics_Tutorial content/python_basics
mv content/python3_grundlagenkurs content/python_basics_DE
mv content/Python3_Package_Examples content/python_packages
mv content/Python3_Reference content/python_reference
mv content/python_testing_tutorial content/python_testing
mv content/Biopython_Tutorial content/biopython
mv content/training_and_teaching_methods content/teaching
