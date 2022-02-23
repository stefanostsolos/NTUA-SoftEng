#!/usr/bin/env python3

import os

dir = os.path.dirname(os.path.realpath(__file__))
os.system(f"cd {os.path.join(dir, 'backend')} && npm install")
os.system(f"cd {os.path.join(dir, 'cli')} && npm install && npm install -g")
os.system(f"cd {os.path.join(dir, 'frontend')} && npm install && npm run build")
os.system(f"cd {os.path.join(dir, 'test-cli')} && npm install")
