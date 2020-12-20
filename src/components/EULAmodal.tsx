import React, { useState } from "react";
import {
  IonRow,
  IonCol,
  IonModal,
  IonButton,
  IonGrid,
  IonContent,
  IonFooter
} from "@ionic/react";

const EULAmodal: React.FC<{
  showingEulaModal: boolean;
  setEulaModal: Function;
}> = (props) => {
  return (
    <IonModal isOpen={props.showingEulaModal} cssClass="modalClass">
      <IonContent className="hoodModalWrapper">
        <IonGrid>
          <br/><br/>
          <div style={{ margin: '14px' }}>
            <span style={{ fontWeight: "bold", fontSize: "15pt" }}>
            End-User License Agreement (EULA) of Cool Neighbors</span>
            <br/><br/>
            This End-User License Agreement ("EULA") is a legal agreement between you and Cool Neighbors.
            <br/><br/>
            This EULA agreement governs your acquisition and use of our Cool Neighbors software ("Software") directly from Cool Neighbors or indirectly through a Cool Neighbors authorized reseller or distributor (a "Reseller"). 
            <br/><br/>
            Please read this EULA agreement carefully before completing the installation process and using the Cool Neighbors software. It provides a license to use the Cool Neighbors software and contains warranty information and liability disclaimers.
            <br/><br/>
            By clicking "I accept the Cool Neighbors License agreement", or by installing and/or using the Cool Neighbors software, you are confirming your acceptance of the Software and agreeing to become bound by the terms of this EULA agreement.
            <br/><br/>
            If you are entering into this EULA agreement on behalf of a company or other legal entity, you represent that you have the authority to bind such entity and its affiliates to these terms and conditions. If you do not have such authority or if you do not agree with the terms and conditions of this EULA agreement, do not install or use the Software, and you must not accept this EULA agreement.
            <br/><br/>
            This EULA agreement shall apply only to the Software supplied by Cool Neighbors herewith regardless of whether other software is referred to or described herein. The terms also apply to any Cool Neighbors updates, supplements, Internet-based services, and support services for the Software, unless other terms accompany those items on delivery. If so, those terms apply.
            <br/><br/>
            <span style={{fontWeight: "bold"}}>License Grant</span>
            <br/><br/>
            Cool Neighbors hereby grants you a personal, non-transferable, non-exclusive license to use the Cool Neighbors software on your devices in accordance with the terms of this EULA agreement.
            <br/><br/>
            You are permitted to load the Cool Neighbors software (for example a PC, laptop, mobile or tablet) under your control. You are responsible for ensuring your device meets the minimum requirements of the Cool Neighbors software.
            <br/><br/>
            You are not permitted to:<br/>
            <ul>
            <li>Edit, alter, modify, adapt, translate or otherwise change the whole or any part of the Software nor permit the whole or any part of the Software to be combined with or become incorporated in any other software, nor decompile, disassemble or reverse engineer the Software or attempt to do any such things</li>
            <li>Reproduce, copy, distribute, resell or otherwise use the Software for any commercial purpose</li>
            <li>Allow any third party to use the Software on behalf of or for the benefit of any third party</li>
            <li>Use the Software in any way which breaches any applicable local, national or international law</li>
            <li>use the Software for any purpose that Cool Neighbors considers is a breach of this EULA agreement</li>
            </ul>
            <br/>
            <span style={{fontWeight: "bold"}}>User-Generated Objectionable Content</span>
            <br/><br/>
            Cool Neighbors maintains a zero-tolerance policy regarding user-generated objectionable content.  Objectionable content may not be uploaded, displayed, or referenced (linked to) on the Cool Neighbors app.   Objectionable content includes, but is not limited to:
            <ul>
            <li>Sexually explicit materials</li>
            <li>Obscene, defamatory, libelous, slanderous, violent, hateful, and/or unlawful content, profanity, or harassment</li>
            <li>Content that infringes upon the rights of any third party, including copyright, trademark, privacy, publicity, or other personal or proprietary right, or that is deceptive or fraudulent</li>
            <li>Content that promotes the use or sale of illegal or regulated substances, tobacco products, ammunition and/or firearms</li>
            <li>Gambling, including without limitation, any online casino, sports books, bingo or poker.</li>
            </ul>
            Any user can flag content they deem objectionable for review.  Content will be moderated by Cool Neighbors to ensure the timely removal of any and all objectional content.  User accounts which have been confirmed responsible for posting objectional content will be restricted from access to the Cool Neighbors app.
            <br/><br/>
            <span style={{fontWeight: "bold"}}>Intellectual Property and Ownership</span>
            <br/><br/>
            Cool Neighbors shall at all times retain ownership of the Software as originally downloaded by you and all subsequent downloads of the Software by you. The Software (and the copyright, and other intellectual property rights of whatever nature in the Software, including any modifications made thereto) are and shall remain the property of Cool Neighbors.
            Cool Neighbors reserves the right to grant licenses to use the Software to third parties.
            <br/><br/>
            <span style={{fontWeight: "bold"}}>Termination</span>
            <br/><br/>
            This EULA agreement is effective from the date you first use the Software and shall continue until terminated. You may terminate it at any time upon written notice to Cool Neighbors.
            It will also terminate immediately if you fail to comply with any term of this EULA agreement. Upon such termination, the licenses granted by this EULA agreement will immediately terminate and you agree to stop all access and use of the Software. The provisions that by their nature continue and survive will survive any termination of this EULA agreement.
            <br/><br/>
            <span style={{fontWeight: "bold"}}>Governing Law</span>
            <br/><br/>
            This EULA agreement, and any dispute arising out of or in connection with this EULA agreement, shall be governed by and construed in accordance with the laws of the United States.
            <br/><br/>
            </div>
        </IonGrid>
      </IonContent>
      <IonFooter mode="ios" className="ion-text-center footerHeight">
        <IonRow>
          <IonCol className="ion-align-items-center">
            <IonButton style={{marginTop: '10px'}} onClick={() => props.setEulaModal(false)}>
              DONE
        </IonButton>
          </IonCol>
        </IonRow>
      </IonFooter>
    </IonModal>
  );
};

export default EULAmodal;
