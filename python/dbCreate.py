import requests
from bs4 import BeautifulSoup
import xlwt
import pymongo
import json
import time

myClient = pymongo.MongoClient('mongodb://localhost:27017/')
# 目标数据库
db = myClient.nmusic
singers = db["singers"]
topsingers = db["topsingers"]
tag = db["tag"]
banner = db["banner"]
songs = db["songs"]
rank = db["rank"]
newsongs = db["newsongs"]
sheettype = db['sheettype']
hotstyle = db['hotstyle']
playlist = db['playlist']
album = db['album']
mv = db['mv']

# 源数据库
dbs = myClient.gmusic


def getAlbum():
    for x in dbs["album"].find():
        data = {
            'id': x['id'],
            'name': x['name'],
            'artistId': x['artistId'],
            'blurPicUrl': x['blurPicUrl'],
            'picUrl': x['picUrl'],
            'publishTime': x['publishTime'],
            'company': x['company'],
        }
        print("+++++++++++数据插入成功++++++++++")
        album.insert_one(data)


def getBanner():
    for x in dbs['banner'].find():
        data = {
            'typeTitle': x['typeTitle'],
            'imageUrl': x['imageUrl'],
            'id': x['targetId'],
            'url': x['targetId'],
        }
        print("+++++++++++数据插入成功++++++++++")
        banner.insert_one(data)


def getTags():
    hotList = [
        "华语", "流行", "摇滚", "民谣", "电子", "另类/独立", "轻音乐", "综艺", "影视原声", "ACG"
    ]
    for x in dbs['sheettype'].find():
        data = {
            'name': x['name'],
            'type': x['type'],
            'category': x['category'],
            'hot': False
        }
        for item in hotList:
            if (x['name'] == item):
                data['hot'] = True
                continue
        print("+++++++++++数据插入成功++++++++++")
        tag.insert_one(data)


def getSingers():
    for x in dbs['singers'].find():
        data = {
            'id': x['id'],
            'name': x['name'],
            'type': x['type'],
            'area': x['area'],
            'mvSize': x['mvSize'],
            'musicSize': x['musicSize'],
            'albumSize': x['albumSize'],
            'img1v1Url': x['img1v1Url'],
            'picUrl': x['picUrl'],
            'briefDesc': x['briefDesc'],
            'introduction': x['introduction'],
        }
        print("+++++++++++数据插入成功++++++++++")
        singers.insert_one(data)


def getMV():
    for x in dbs['mv'].find():
        data = {
            'id': x['id'],
            'name': x['name'],
            'artistId': x['artistId'],
            'imgurl': x['imgurl'],
            'imgurl16v9': x['imgurl16v9'],
            'duration': x['duration'],
            'playCount': x['playCount'],
            'publishTime': x['publishTime'],
        }
        print("+++++++++++数据插入成功++++++++++")
        mv.insert_one(data)


def getPlayList():
    for x in dbs['playlist'].find():
        data = {
            'id': x['id'],
            'name': x['name'],
            'createTime': x['createTime'],
            'updateTime': x['updateTime'],
            'description': x['description'],
            'tags': x['tags'],
            'coverImgUrl': x['coverImgUrl'],
            'playCount': x['playCount'],
            'songList': x['songList'],
            'creatorId': x['creator']['userId'],
        }
        print("+++++++++++数据插入成功++++++++++")
        playlist.insert_one(data)


def getSongs():
    for x in dbs['songs'].find():
        data = {
            'id':
            x['id'],
            'name':
            x['name'],
            'publishTime':
            x['publishTime'],
            'duration':
            x['dt'],
            'coverImgUrl':
            x['al']['picUrl'],
            'artistId':
            x['ar'][0]['id'],
            'url':
            "https://music.163.com/song/media/outer/url?id=" + str(x['id']) +
            ".mp3"
        }
        print("+++++++++++数据插入成功++++++++++")
        songs.insert_one(data)


def getRank():
    for x in dbs['rank'].find():
        data = {
            'id': x['id'],
            'name': x['name'],
            'createTime': x['createTime'],
            'updateTime': x['updateTime'],
            'description': x['description'],
            'tags': x['tags'],
            'playCount': x['playCount'],
            'coverImgUrl': x['coverImgUrl'],
            'id': x['id'],
            'name': x['name'],
            'creatorId': None
        }
        print("+++++++++++数据插入成功++++++++++")
        playlist.insert_one(data)


def request_data(url):
    try:
        response = requests.get(url)
        if response.status_code == 200:
            return response.text
    except requests.RequestException:
        return None


def getRankPlaylist():
    for x in playlist.find():
        if (x['creatorId'] == None):
            # print(x['name'])
            baseUrl = "http://localhost:3000/top/list?id="
            html = request_data(baseUrl + str(x['id']))
            data = json.loads(html)
            songList = []
            for i in data['playlist']['tracks']:
                songList.append(i['id'])
            # print(songList)
            playlist.update_one({"id": x['id']},
                                {"$set": {
                                    "songList": songList
                                }})
            print("+++++++++++数据插入成功++++++++++")
            time.sleep(1)


def getRankSong():
    for x in playlist.find():
        if (x['creatorId'] == None):
            ids = ""
            for item in x['songList']:
                ids = ids + ',' + str(item)
            ids = ids[1:]
            # print(ids)
            url = "http://localhost:3000/song/detail?ids=" + ids
            html = request_data(url)
            res = json.loads(html)
            for i in res['songs']:
                data = {
                    'id':
                    i['id'],
                    'name':
                    i['name'],
                    'publishTime':
                    i['publishTime'],
                    'duration':
                    i['dt'],
                    'coverImgUrl':
                    i['al']['picUrl'],
                    'url':
                    "https://music.163.com/song/media/outer/url?id=" +
                    str(i['id']) + ".mp3",
                    'artistId':
                    i['ar'][0]['id']
                }
                re = songs.find_one({'id': i['id']})
                if re is not None:
                    print("+++++++++++++++数据重复++++++++++++++")
                    continue
                songs.insert_one(data)
            print("+++++++++++数据插入成功++++++++++")
            time.sleep(1)


def main():
    print("主函数入口！！！")

    # getAlbum()
    # getBanner()
    # getTags()
    # getSingers()
    # getMV()
    # getPlayList()
    # getSongs()
    # getRank()
    # getRankPlaylist()
    getRankSong()


main()
