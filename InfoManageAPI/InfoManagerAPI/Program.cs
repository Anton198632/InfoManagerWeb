using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using InfoMAPI;

namespace InfoManagerAPI
{
    class Program
    {
        static void Main(string[] args)
        {
            new InfoMAPI.Database.DBHelper("localhost", @"d:\Python\djangoReactProject\info_base_v2.ib");
            //String infoListJson = InfoMAPI.Database.DBHelper.GetInfoList(100, 1);
            //string data = InfoMAPI.Database.DBHelper.GetInfoData(2);
            //string data = InfoMAPI.Database.DBHelper.GetInfoListByWorld("пользо", "15.09.2022 - 16.09.2022", 100, 1);

            //InfoMAPI.Database.DBHelper.AddNewInfo(@"{
            //  'Key': 9,
            //  'Offer': 'Antony',
            //  'Operator': 'John',
            //  'Thema': 'NEWS',
            //  'SourceType': 'Teterev',
            //  'Data': 'привет, я нагуглила что у тебя есть еще один канал, но он как-то не активно идет, там всего 20 подписчиков, а на тот что с видео - 40 тысяч.\r\nМожет ты его удалил?\r\nЯ бы хотела посмотреть, что ты там выкладываешь и мне бы очень хотелось, чтобы ты посмотрел на меня, так как у меня есть шанс быть на тебя похожей.\r\nЯ очень долго искала себя в жизни, но я поняла, что это не мое и я не хочу быть как все.\r\nУ меня очень много комплексов.',
            //  'DateTime': '2022-09-18T04:33:56.899Z'
            //}");

            //InfoMAPI.Database.DBHelper.UpdateAttachments(15, new byte[] { 1, 2, 3 }, "1221");

            //var attach = InfoMAPI.Database.DBHelper.GetAttachment("1");

            InfoMAPI.Database.DBHelper.UpdateNotice("11", "Hello, WORLD!!!");
        }
    }
}
