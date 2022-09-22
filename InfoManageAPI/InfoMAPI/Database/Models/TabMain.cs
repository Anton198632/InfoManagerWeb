using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InfoMAPI.Database.Models
{
    public class TabMain
    {
        public int Key { get; set; }                    // "T_INKEY"	INTEGER NOT NULL,
        public string DateTime { get; set; }            //"DATE_TIME"	TIMESTAMP NOT NULL,
        public string SourceType { get; set; }          //"SOURCE_TYPE"	VARCHAR(25) CHARACTER SET WIN1251,
        public string Operator { get; set; }            //"T_OPERATOR"	VARCHAR(50) CHARACTER SET WIN1251,
        public string Thema { get; set; }               //"TEMA"	VARCHAR(25) CHARACTER SET WIN1251,
        public string Offer { get; set; }               //"OFFER"	VARCHAR(15) CHARACTER SET WIN1251,
        public string Notice { get; set; }              //"PRIMECHANIE"	VARCHAR(100) CHARACTER SET WIN1251,
        public int IsSuccess { get; set; }              //"IS_SUCSESS"	INTEGER DEFAULT 0 NOT NULL,
        public string Dest { get; set; }                //"DEST"	VARCHAR(200) CHARACTER SET WIN1251,
        public string Data { get; set; }                //"DATA"	BLOB SUB_TYPE TEXT SEGMENT SIZE 80 CHARACTER SET WIN1251,
        public byte[] Application { get; set; }         //"APPLICATION"	BLOB SUB_TYPE 0 SEGMENT SIZE 80,
        public string WithApplication { get; set; }     //"WITH_APPLICATION"	VARCHAR(200) CHARACTER SET WIN1251 DEFAULT 'no' NOT NULL,


        public static string ToJSON(List<TabMain> rows)
        {
            return JsonConvert.SerializeObject(rows);
        }

        public static TabMain FormJSON(string json)
        {
            return JsonConvert.DeserializeObject<TabMain>(json);

        }
    }
}
