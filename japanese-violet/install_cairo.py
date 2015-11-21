import platform
import os
import sys

print sys.argv

if sys.argv[1] == "install":
    if platform.system() == "Darwin":
        print "You're using OS X\n"
        os.system("brew install cairo")
    elif platform.system() == "Linux":
        print "You're using Linux"
        if platform.dist()[0] == "Ubuntu" || platform.dist()[0] == "Debian" || platform.dist()[0] == "elementary OS":
            os.system("sudo apt-get install libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++")
elif sys.argv[1] == "uninstall":
    if platform.system() == "Darwin":
        print "You're using OS X\n"
        os.system("brew uninstall cairo")
    elif platform.system() == "Linux":
        print "You're using Linux"
        if platform.dist()[0] == "Ubuntu" || platform.dist()[0] == "Debian" || platform.dist()[0] == "elementary OS":
            os.system("sudo apt-get remove libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++")
else:
    print "Use install/uninstall args"
