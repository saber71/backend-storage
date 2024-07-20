import json
import os

from setuptools import setup, find_packages

# 获取当前目录
current_directory = os.getcwd()

# 构建文件路径
file_path = os.path.join(current_directory, "package.json")

# 读取JSON文件
with open(file_path, "r", encoding="utf-8") as file:
    packageJson = json.load(file)

setup(
    name="backend-storage",
    version=packageJson["version"],
    packages=find_packages(),
    install_requires=["requests", "fastapi"],
    description="提供了基于 Node.js 开发的 RESTful 接口，可以方便地进行数据的增删改查（CRUD）操作以及高效的数据搜索",
)
