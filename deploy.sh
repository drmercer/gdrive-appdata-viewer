#!/bin/sh
zip dist.zip -r public &&
scp dist.zip site:public_html/ &&
ssh site '
	unzip -of public_html/dist.zip -d public_html/ &&
	cp -R public_html/public/* public_html/gdad-inspector/'
