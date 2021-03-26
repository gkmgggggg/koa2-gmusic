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
singers = db["singers"]
topsingers = db["topsingers"]
banner = db["banner"]
songs = db["songs"]
rank = db["rank"]
newsongs = db["newsongs"]
sheettype = db['sheettype']
hotstyle = db['hotstyle']
playlist = db['playlist']
album = db['album']
mv = db['mv']

offset = 0
limit = 40
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


def getSinger():
    baseUrl = 'http://localhost:3000/artist/list'
    for i in range(len(types)):
        for j in range(len(areas)):
            getSingerData(baseUrl, i, j, offset)
    return


def getSingerData(baseUrl, i, j, offset):
    url = baseUrl+'?type=' + \
        str(types[i]) + '&area='+str(areas[j]) + \
        '&limit=40'+'&offset='+str(offset)
    html = request_douban(url)
    data = json.loads(html)
    artistList = data['artists']
    if(len(artistList) == 0):
        return
    for item in artistList:
        item['type'] = types[i]
        item['area'] = areas[j]
    singers.insert_many(artistList)
    print("+++++++++++数据添加成功++++++++++++++++++")
    time.sleep(1)
    # if(data['more'] == True and offset <= 40):
    #     offset = offset+40
    #     getSingerData(baseUrl, i, j, offset)
    return


def getTopSinger():
    url = 'http://localhost:3000/top/artists?limit=30'
    html = request_douban(url)
    data = json.loads(html)
    artistList = data['artists']
    topsingers.insert_many(artistList)
    print("+++++++++++数据添加成功++++++++++++++++++")
    return


def getBanner():
    url = 'http://localhost:3000/banner'
    html = request_douban(url)
    data = json.loads(html)
    banner.insert_many(data['banners'])
    print("+++++++++++++轮播图数据插入成功+++++++++++++++++++")


def getRankList():
    url = 'http://localhost:3000/toplist/detail'
    html = request_douban(url)
    data = json.loads(html)
    rank.insert_many(data['list'])
    print("+++++++++++++推荐新歌数据插入成功+++++++++++++++++++")


def getSongSheetType():
    url = 'http://localhost:3000/playlist/catlist'
    html = request_douban(url)
    data = json.loads(html)
    sheettype.insert_many(data['sub'])
    print("+++++++++++++歌单类型插入成功+++++++++++++++++++")


def getHotStyle():
    url = 'http://localhost:3000/playlist/hot'
    html = request_douban(url)
    data = json.loads(html)
    hotstyle.insert_many(data['tags'])
    print("+++++++++++++歌单热门类型插入成功+++++++++++++++++++")


def getPlayList(offset):
    baseUrl = 'http://localhost:3000/top/playlist'
    url = baseUrl+'?offset='+str(offset)
    html = request_douban(url)
    data = json.loads(html)
    playlist.insert_many(data['playlists'])
    print("+++++++++++++歌单插入成功+++++++++++++++++++")
    time.sleep(1)
    if(data['more'] == True and offset < 5000):
        offset = offset+50
        getPlayList(offset)
    return


def getNewSongs():
    url = 'https://nicemusic-api.lxhcool.cn/personalized/newsong'
    html = request_douban(url)
    data = json.loads(html)
    songList = data['result']
    for item in songList:
        surl = 'https://nicemusic-api.lxhcool.cn/song/detail?ids=' + \
            str(item['id'])
        shtml = request_douban(surl)
        sdata = json.loads(shtml)
        song = sdata['songs'][0]
        newsongs.insert_one(song)
        # print(song)
        print("+++++++++++++推荐新歌数据插入成功+++++++++++++++++++")
        time.sleep(1)


def getSongs():
    baseUrl = 'http://localhost:3000/artist/top/song'
    for x in singers.find():
        url = baseUrl+'?id='+str(x['id'])
        html = request_douban(url)
        data = json.loads(html)
        songList = []
        ids = ''
        for item in data['songs']:
            ids = ids+','+str(item['id'])
            songList.append(item['id'])
        singers.update_one({"id": x['id']}, {"$set": {"songList": songList}})
        print("+++++++++++++++++++++++++++")
        time.sleep(1)
        # ids = ids[1:]
        # # print(ids)
        # surl = 'http://localhost:3000/song/detail?ids=' + ids
        # shtml = request_douban(surl)
        # sdata = json.loads(shtml)
        # songList = sdata['songs']
        # for item in songList:
        #     re = songs.find_one({"id": item['id']})
        #     if re is not None:
        #         print("+++++++++++++++数据重复++++++++++++++")
        #         time.sleep(1)
        #         continue
        #     songs.insert_one(item)
        #     print("+++++++++++++歌曲数据插入成功+++++++++++++++++++")
        # time.sleep(1)


def getAlbum():
    baseUrl = 'http://localhost:3000/artist/album'
    for x in singers.find():
        url = baseUrl+'?id='+str(x['id'])
        html = request_douban(url)
        data = json.loads(html)
        if len(data['hotAlbums']):
            for item in data['hotAlbums']:
                item['artistId'] = int(x['id'])
            album.insert_many(data['hotAlbums'])
            print("+++++++++++++++++++++++++++")
            time.sleep(1)


def getMV():
    baseUrl = 'http://localhost:3000/artist/mv'
    for x in singers.find():
        url = baseUrl+'?id='+str(x['id'])
        html = request_douban(url)
        data = json.loads(html)
        singers.update_one({"id": x['id']}, {
                           "$set": {"mvSize": len(data['mvs'])}})
        if len(data['mvs']):
            for item in data['mvs']:
                item['artistId'] = int(x['id'])
            mv.insert_many(data['mvs'])
            print("+++++++++++++++++++++++++++")
            time.sleep(1)


def getSingerDesc():
    baseUrl = 'http://localhost:3000/artist/desc'
    for x in singers.find():
        url = baseUrl+'?id='+str(x['id'])
        html = request_douban(url)
        data = json.loads(html)
        singers.update_one({"id": x['id']}, {
                           "$set": {"briefDesc": data['briefDesc'], "introduction": data['introduction']}})
        print("+++++++++++++数据添加成功++++++++++++++")
        time.sleep(1)


def getSongSheet(offset):
    baseUrl = 'http://localhost:3000/top/playlist'
    url = baseUrl+'?offset='+str(offset)
    html = request_douban(url)
    data = json.loads(html)
    if(len(data['playlists']) != 0):
        for item in data['playlists']:
            songList = []
            surl = 'http://localhost:3000/playlist/detail' + \
                '?id='+str(item['id'])
            shtml = request_douban(surl)
            sdata = json.loads(shtml)
            print("++++++++++++++++++++++++++++++")
            for i in sdata['playlist']['tracks']:
                songList.append(i['id'])
            item['songList'] = songList
            time.sleep(.5)
        playlist.insert_many(data['playlists'])
    if(data['more'] == True and offset < 450):
        offset = offset+50
        getSongSheet(offset)


def getListSongs():
    for x in playlist.find():
        ids = ""
        for item in x['songList']:
            ids = ids+','+str(item)
        ids = ids[1:]
        # print(ids)
        url = 'http://localhost:3000/song/detail?ids=' + ids
        html = request_douban(url)
        data = json.loads(html)
        songList = data['songs']
        for item in songList:
            re = songs.find_one({"id": item['id']})
            if re is not None:
                print("+++++++++++++++数据重复++++++++++++++")
                continue
            songs.insert_one(item)
            print("+++++++++++++歌曲数据插入成功+++++++++++++++++++")
        time.sleep(1)

# /mv/url?id=5436712


def getMvUrl():
    for x in mv.find():
        url = 'http://localhost:3000/mv/url?id='+str(x['id'])
        html = request_douban(url)
        data = json.loads(html)
        # print(data['data']['url'])
        mv.update_one({"id": x['id']}, {"$set": {"url": data['data']['url']}})
        print("+++++++++++数据添加成功+++++++++++++++")
        time.sleep(1)


def main():
    print("主函数入口")
    # getBanner()
    # getNewSongs()
    # getRankList()
    # getSongSheetType()
    # getHotStyle()

    # getSinger()
    # getPlayList(offset)
    # getNewSongs()
    # getTopSinger()
    # getSongs()
    # getAlbum()
    # getMV()
    # getSingerDesc()
    # getSongSheet(offset)
    # getListSongs()
    getMvUrl()


main()
