import * as FirebaseAdmin from "firebase-admin";

export interface FirebaseOption {
    serviceAccountPath: string
    isSendPush?: boolean
    types: PushType
    topics: TopicList
}

 export interface PushType {
  [key: string]: string
}

export interface TopicList {
  [key: string]: string
}


 export class Firebase {
  #Types: PushType;
  #TopicList: TopicList;
  #IS_SEND_PUSH: boolean;
  constructor(option: FirebaseOption) {
      this.#IS_SEND_PUSH = (option.isSendPush !== undefined) ? option.isSendPush : true;

      if (this.#IS_SEND_PUSH === true) {
          FirebaseAdmin.initializeApp({
              credential: FirebaseAdmin.credential.cert(option.serviceAccountPath),
          });
      }
      this.#Types = option.types;
      this.#TopicList = option.topics;
  }


  __checkAllowType(typeKey: string) {
      const values = Object.values(this.#Types);
      const check = values.some(value => value === typeKey);
      if(!check){
          throw new Error("Not allow topic")
      }
  }

  __checkAllowTopic(topicKey: string) {
      const values = Object.values(this.#TopicList);
      const check = values.some(value => value === topicKey);
      if (!check) {
          throw new Error("Not allow topic")
      }
  }


  SendFCM = (FcmKeys: string[], Title: string, Body: string, Type: string, Value = "", Image = null) => {
      this.__checkAllowType(Type)
      const message: FirebaseAdmin.messaging.MulticastMessage = {
          notification: {
              //title: Title,   //제목
              body: Body,  //보낼메시지
          },
          data: {
              //Title: Title,
              type: Type,
              body: Body,
              value: Value
          },
          tokens: FcmKeys,
          android: {
              notification: {
                  body: Body,
                  channelId: Type
              }
          }
      }

      if (Title != null && Title != undefined) {
          message.notification["title"] = Title;
          message.android.notification["title"] = Title;
          message.data["title"] = Title;
      }
      if (Image != null && Image != undefined && Image != "") {
          message.notification["image"] = `${Image}`;
          message.android.notification["title"] = Title;
          message.data["image"] = `${Image}`;
      }

      console.log("====Push Data======");
      console.log(message);
      console.log("is allow? : " + this.#IS_SEND_PUSH);

      return new Promise((resolve, reject) => {

          if (this.#IS_SEND_PUSH == true && FcmKeys.length > 0) {
              FirebaseAdmin.messaging().sendMulticast(message)
                  .then(response => {
                      console.log("push success!!");
                      console.log(response);
                      resolve(response);
                  })
                  .catch(err => {
                      console.error("Push Message send fail...");
                      console.error(err);
                      reject(err);
                  })
          } else {
              console.log("Not push Allow");
              resolve({ text: "Not push Allow", dev: true });
          }
      });


  }

  SendTopicPush = async (Topic: string, Title: string, Body: string, Type: string, Value = "", Image = null) => {
      this.__checkAllowTopic(Topic)
      const message = {
          notification: {
              body: Body  //보낼메시지
          },
          data: {
              type: Type,
              body: Body,
              value: Value
          },
          topic: Topic
      }

      if (Title != null && Title != undefined) {
          message.notification["title"] = Title;
          message.data["title"] = Title;
      }
      if (Image != null && Image != undefined && Image != "") {
          message.notification["image"] = `${Image}`;
          message.data["image"] = `${Image}`;
      }

      console.log("====Push Data======");
      console.log(message);
      console.log("is allow? : " + this.#IS_SEND_PUSH);
      return new Promise((resolve, reject) => {
          if (this.#IS_SEND_PUSH == true) {
              FirebaseAdmin.messaging().send(message)
                  .then((response) => {
                      // Response is a message ID string.
                      console.log("push success!!");
                      resolve(response)
                  })
                  .catch((error) => {
                      console.error("Push Message send fail...");
                      reject(error)
                  });
          } else {
              console.log("Not push Allow");
              resolve({ text: "Not push Allow", dev: true });
          }
      })
  }


  SubscribeTopic = (DeviceTokens: string | string[], topic: string) => {
      //if (process.env.IS_SEND_PUSH == "true") {
      FirebaseAdmin.messaging().subscribeToTopic(DeviceTokens, topic)
          .then(response => {
              console.log("push Subscribe!!");
              console.log(response);
          })
          .catch(err => {
              console.error("Push Subscribe fail...");
              console.error(err);
              return;
          })
      //}
  }


  UnSubscribeTopic = (DeviceTokens: string | string[], topic: string) => {
      FirebaseAdmin.messaging().unsubscribeFromTopic(DeviceTokens, topic)
          .then(response => {
              console.log("push UnSubscribe!!");
              console.log(response);
          })
          .catch(err => {
              console.error("Push UnSubscribe fail...");
              console.error(err);
              return;
          })
      //}
  }

}
