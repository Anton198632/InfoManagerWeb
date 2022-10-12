using FirebirdSql.Data.FirebirdClient;
using InfoMAPI.Database.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InfoMAPI.Database
{
    public class DBHelper
    {

        static string server;
        static string dbPath;
        public DBHelper(string server, string dbPath)
        {
            DBHelper.server = server;
            DBHelper.dbPath = dbPath;

        }


        private static FbConnection fbConnection = null;

        private static FbConnection GetConnection()
        {
            FbConnectionStringBuilder cs = new FbConnectionStringBuilder();
            cs.DataSource = server;
            cs.Database = dbPath;
            cs.UserID = "SYSDBA";
            cs.Password = "masterkey";
            cs.Dialect = 3;
            cs.Charset = "WIN1251";

            if (fbConnection == null || fbConnection.State == System.Data.ConnectionState.Closed)
            {
                fbConnection = new FbConnection(cs.ToString());
                fbConnection.Open();
            }

            return fbConnection;
        }

        public static String GetInfoList(int count, int offset)
        {

            FbCommand fbCommand = new FbCommand();
            fbCommand.Connection = GetConnection();
            fbCommand.CommandText = $@"select 
                T_INKEY, DATE_TIME, SOURCE_TYPE, T_OPERATOR, TEMA, OFFER, PRIMECHANIE,
                IS_SUCSESS, DEST from TAB_MAIN ORDER BY T_INKEY DESC rows {offset} to {offset + count}";

            FbDataReader dr = fbCommand.ExecuteReader();
            List<Models.TabMain> result = new List<Models.TabMain>();
            while (dr.Read())
            {
                result.Add(new Models.TabMain()
                {
                    Key = dr.GetInt32(0),
                    DateTime = dr.GetDateTime(1).ToString("G"),
                    SourceType = dr.GetString(2),
                    Operator = dr.GetString(3),
                    Thema = dr.GetString(4),
                    Offer = dr.GetString(5),
                    Notice = dr.GetString(6),
                    IsSuccess = dr.GetInt32(7),
                    Dest = dr.GetString(8)
                });


            }

            return Models.TabMain.ToJSON(result);
        }

        public static String GetInfoListByWorld(string word, string period, int count, int offset, int key = -1)
        {
            string from = period.Split(new string[] { " - " }, StringSplitOptions.None)[0];
            string to = period.Split(new string[] { " - " }, StringSplitOptions.None)[1];

            FbCommand fbCommand = new FbCommand();
            fbCommand.Connection = GetConnection();
            string byKey = key != -1 ? ("and T_INKEY='" + key.ToString() + "'") : "";
            fbCommand.CommandText = $@"select T_INKEY, DATE_TIME, SOURCE_TYPE, T_OPERATOR, TEMA, OFFER, PRIMECHANIE, IS_SUCSESS, DEST from TAB_MAIN
                                        where DATA like '%{word}%' and (DATE_TIME between '{from} 0:00:00' and '{to} 23:59:59')
                                        {byKey}
                                        order by T_INKEY rows {offset} to {offset + count}";

            FbDataReader dr = fbCommand.ExecuteReader();
            List<Models.TabMain> result = new List<Models.TabMain>();
            while (dr.Read())
            {
                result.Add(new Models.TabMain()
                {
                    Key = dr.GetInt32(0),
                    DateTime = dr.GetDateTime(1).ToString("G"),
                    SourceType = dr.GetString(2),
                    Operator = dr.GetString(3),
                    Thema = dr.GetString(4),
                    Offer = dr.GetString(5),
                    Notice = dr.GetString(6),
                    IsSuccess = dr.GetInt32(7),
                    Dest = dr.GetString(8)
                });


            }

            return Models.TabMain.ToJSON(result);
        }


        public static String GetInfoListByWorlds(string words, string period, int count, int offset, int key = -1)
        {
            string from = period.Split(new string[] { " - " }, StringSplitOptions.None)[0];
            string to = period.Split(new string[] { " - " }, StringSplitOptions.None)[1];

            FbCommand fbCommand = new FbCommand();
            fbCommand.Connection = GetConnection();
            string byKey = key != -1 ? ("and T_INKEY='" + key.ToString() + "'") : "";

            string[] _words = words.Split(',');
            Func<string> otherWordsInConditionBuild = ()  =>
             {
                 StringBuilder condition = new StringBuilder();
                 foreach (string word in _words)
                 {
                     condition.Append($"OR DATA like '%{word}%' ");
                 }
                 return condition.ToString();
             };

            fbCommand.CommandText = $@"select T_INKEY, DATE_TIME, SOURCE_TYPE, T_OPERATOR, TEMA, OFFER, PRIMECHANIE, IS_SUCSESS, DEST from TAB_MAIN
                                        where DATA like '%{_words[0]}%' {otherWordsInConditionBuild()} and (DATE_TIME between '{from} 0:00:00' and '{to} 23:59:59')
                                        {byKey}
                                        order by T_INKEY rows {offset} to {offset + count}";

            FbDataReader dr = fbCommand.ExecuteReader();
            List<Models.TabMain> result = new List<Models.TabMain>();
            while (dr.Read())
            {
                result.Add(new Models.TabMain()
                {
                    Key = dr.GetInt32(0),
                    DateTime = dr.GetDateTime(1).ToString("G"),
                    SourceType = dr.GetString(2),
                    Operator = dr.GetString(3),
                    Thema = dr.GetString(4),
                    Offer = dr.GetString(5),
                    Notice = dr.GetString(6),
                    IsSuccess = dr.GetInt32(7),
                    Dest = dr.GetString(8)
                });


            }

            return Models.TabMain.ToJSON(result);
        }


        public static String GetInfoData(int key)
        {
            FbCommand fbCommand = new FbCommand();
            fbCommand.Connection = GetConnection();
            fbCommand.CommandText = $@"select T_INKEY, DATE_TIME, SOURCE_TYPE, T_OPERATOR, TEMA, OFFER, PRIMECHANIE, IS_SUCSESS, DEST, DATA, WITH_APPLICATION
                                            from TAB_MAIN WHERE T_INKEY={key}";

            FbDataReader dr = fbCommand.ExecuteReader();
            List<Models.TabMain> result = new List<Models.TabMain>();
            while (dr.Read())
            {
                result.Add(new Models.TabMain()
                {
                    Key = dr.GetInt32(0),
                    DateTime = dr.GetDateTime(1).ToString("G"),
                    SourceType = dr.GetString(2),
                    Operator = dr.GetString(3),
                    Thema = dr.GetString(4),
                    Offer = dr.GetString(5),
                    Notice = dr.GetString(6),
                    IsSuccess = dr.GetInt32(7),
                    Dest = dr.GetString(8),
                    Data = dr.GetString(9),
                    WithApplication = dr.GetString(10)
                });


            }

            return Models.TabMain.ToJSON(result);
        }

        public static bool DeleteInformation (string key)
        {
            FbCommand fbCommand = new FbCommand();
            fbCommand.Connection = GetConnection();
            FbTransaction fbTransaction = fbCommand.Connection.BeginTransaction();
            fbCommand.Transaction = fbTransaction;

            fbCommand.CommandText = $@"delete from TAB_MAIN where T_INKEY='{key}'";

            fbCommand.ExecuteNonQuery();

            fbTransaction.Commit();

            return true;
        }

        public static bool UpdateNotice (string key, string notice)
        {
            FbCommand fbCommand = new FbCommand();
            fbCommand.Connection = GetConnection();
            FbTransaction fbTransaction = fbCommand.Connection.BeginTransaction();
            fbCommand.Transaction = fbTransaction;

            fbCommand.Parameters.Add("NOTICE", FbDbType.VarChar);
            fbCommand.Parameters["NOTICE"].Value = notice;

            fbCommand.CommandText = $@"update TAB_MAIN set PRIMECHANIE=@NOTICE where T_INKEY='{key}'";

            fbCommand.ExecuteNonQuery();

            fbTransaction.Commit();

            return true;

        }

        public static int AddNewInfo(string newInformationJson)
        {
            TabMain tabMain = TabMain.FormJSON(newInformationJson);

            FbCommand fbCommand = new FbCommand();
            fbCommand.Connection = GetConnection();
            FbTransaction fbTransaction = fbCommand.Connection.BeginTransaction();
            fbCommand.Transaction = fbTransaction;

            fbCommand.Parameters.Add("SOURCE_TYPE", FbDbType.VarChar);
            fbCommand.Parameters["SOURCE_TYPE"].Value = tabMain.SourceType;

            fbCommand.Parameters.Add("T_OPERATOR", FbDbType.VarChar);
            fbCommand.Parameters["T_OPERATOR"].Value = tabMain.Operator;

            fbCommand.Parameters.Add("TEMA", FbDbType.VarChar);
            fbCommand.Parameters["TEMA"].Value = tabMain.Thema;

            fbCommand.Parameters.Add("OFFER", FbDbType.VarChar);
            fbCommand.Parameters["OFFER"].Value = tabMain.Offer;

            fbCommand.Parameters.Add("PRIMECHANIE", FbDbType.VarChar);
            fbCommand.Parameters["PRIMECHANIE"].Value = tabMain.Notice;

            fbCommand.Parameters.Add("DATA", FbDbType.Text);
            fbCommand.Parameters["DATA"].Value = tabMain.Data;


            int key = tabMain.Key;

            if (tabMain.Key > 0)
            {
                fbCommand.CommandText = $@"update TAB_MAIN set SOURCE_TYPE=@SOURCE_TYPE, 
                                                               T_OPERATOR=@T_OPERATOR,
                                                               TEMA=@TEMA, 
                                                               OFFER=@OFFER, 
                                                               PRIMECHANIE=@PRIMECHANIE, 
                                                               DATA=@DATA  
                                                           where T_INKEY='{tabMain.Key}'";

                fbCommand.ExecuteNonQuery();

            } else
            {
                fbCommand.CommandText = $@"insert into TAB_MAIN (SOURCE_TYPE, T_OPERATOR, TEMA, OFFER, PRIMECHANIE, DATA) 
                                              values (@SOURCE_TYPE, @T_OPERATOR, @TEMA, @OFFER, @PRIMECHANIE, @DATA)";

                fbCommand.ExecuteNonQuery();

                fbCommand.CommandText = "SELECT GEN_ID(genforid, 0) FROM RDB$DATABASE";
                FbDataReader dr = fbCommand.ExecuteReader();
                while (dr.Read())
                {
                    key = dr.GetInt32(0);
                }
            }

            fbTransaction.Commit();

            return key;
            
            
        }

        public static bool UpdateAttachments (int key, byte[] filesData, string fileNames)
        {

            FbCommand fbCommand = new FbCommand();
            fbCommand.Connection = GetConnection();
            FbTransaction fbTransaction = fbCommand.Connection.BeginTransaction();
            fbCommand.Transaction = fbTransaction;

            fbCommand.Parameters.Add("WITH_APPLICATION", FbDbType.VarChar);
            fbCommand.Parameters["WITH_APPLICATION"].Value = fileNames;

            fbCommand.Parameters.Add("APPLICATION", FbDbType.Binary);
            fbCommand.Parameters["APPLICATION"].Value = filesData;

            fbCommand.CommandText = $@"update TAB_MAIN set WITH_APPLICATION=@WITH_APPLICATION, 
                                                               APPLICATION=@APPLICATION
                                                       where T_INKEY='{key}'";

            fbCommand.ExecuteNonQuery();

            fbTransaction.Commit();

            return true;

        }

        public static TabMain GetAttachment(string key)
        {
            FbCommand fbCommand = new FbCommand();
            fbCommand.Connection = GetConnection();
            fbCommand.CommandText = $@"select WITH_APPLICATION, APPLICATION
                                            from TAB_MAIN WHERE T_INKEY={key}";

            FbDataReader dr = fbCommand.ExecuteReader();
            Models.TabMain result = null;
            while (dr.Read())
            {
                result= new Models.TabMain()
                {
                    WithApplication = dr.GetString(0),
                    Application = (byte[])dr.GetValue(1)
                };
            }


            return result;
        }


    }
}
