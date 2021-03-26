import requests
from bs4 import BeautifulSoup
import xlwt
import pymongo
import json
import time

myclient = pymongo.MongoClient('mongodb://localhost:27017/')
# db = myclient.test
db = myclient.gmusic
singer = db["singer"]
songs = db['songs']
mycol = db["sites"]
offset = 0
limit = 30
types = [1, 2, 3]  # 男歌手，女歌手，乐队
areas = [7, 96, 8, 16, 0]  # 华语，欧美，日本，韩国，其他
# chr(数字) 数字转字母，a~z：97~122.


def request_douban(url):
    try:
        response = requests.get(url)
        if response.status_code == 200:
            return response.text
    except requests.RequestException:
        return None


def getSongs():
    baseUrl = 'http://localhost:3000/artist/songs'
    for x in singer.find():
        url = baseUrl+'?id='+str(x['id'])
        html = request_douban(url)
        data = json.loads(html)
        songList = data['songs']
        for item in songList:
            getSongDetail(item['al']['id'])


def getSongDetail(id):
    url = 'http://localhost:3000/song/detail?ids='+str(id)
    html = request_douban(url)
    if(html == None):
        return
    data = json.loads(html)
    song = data['songs']
    time.sleep(1)
    if(len(song) == 0):
        print("+++++++++++数据不存在++++++++++++++++++")
        return
    songs.insert_one(song[0])
    print("+++++++++++数据添加成功++++++++++++++++++")
    return


def getsong(id):
    song = songs.find_one({"id": id})
    print(song)


def main():
    print("主函数入口")
    getsong(14665983)


main()
