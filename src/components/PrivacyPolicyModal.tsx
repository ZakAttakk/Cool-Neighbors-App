import React, { useState } from "react";
import {
  IonRow,
  IonCol,
  IonModal,
  IonButton,
  IonGrid,
  IonContent,
  IonFooter,
} from "@ionic/react";

const PrivacyPolicyModal: React.FC<{
  showingPrivacyModal: boolean;
  setPrivacyModal: Function;
}> = (props) => {
  return (
    <IonModal isOpen={props.showingPrivacyModal} cssClass="modalClass">
      <IonContent className="hoodModalWrapper">
        <IonGrid>
          <br />
          <br />
          <div style={{ margin: "14px" }}>
            <span style={{ fontWeight: "bold", fontSize: "15pt" }}>
              Privacy Policy
            </span>{" "}
            <br />
            <br />
            Protecting your private information is our priority. This Statement
            of Privacy applies to www.coolneighbors.com and Cool Neighbors and
            governs data collection and usage. For the purposes of this Privacy
            Policy, unless otherwise noted, all references to Cool Neighbors
            include www.coolneighbors.com. The Cool Neighbors website is a
            social site. By using the Cool Neighbors website, you consent to the
            data practices described in this statement.
            <br />
            <br />
            <span style={{ fontWeight: "bold" }}>
              Automatically Collected Information
            </span>{" "}
            <br />
            Information about your computer hardware and software may be
            automatically collected by Cool Neighbors. This information can
            include: your IP address, browser type, domain names, access times
            and referring website addresses. This information is used for the
            operation of the service, to maintain quality of the service, and to
            provide general statistics regarding use of the Cool Neighbors
            website.
            <br />
            <br />
            <span style={{ fontWeight: "bold" }}>
              Security of your Personal Information
            </span>{" "}
            <br />
            Cool Neighbors secures your personal information from unauthorized
            access, use, or disclosure. Cool Neighbors uses the following
            methods for this purpose:
            <br />
            <br />
            - SSL Protocol
            <br />
            <br />
            When personal information (such as a credit card number) is
            transmitted to other websites, it is protected through the use of
            encryption, such as the Secure Sockets Layer (SSL) protocol.
            <br />
            <br />
            We strive to take appropriate security measures to protect against
            unauthorized access to or alteration of your personal information.
            Unfortunately, no data transmission over the Internet or any
            wireless network can be guaranteed to be 100% secure. As a result,
            while we strive to protect your personal information, you
            acknowledge that: (a) there are security and privacy limitations
            inherent to the Internet which are beyond our control; and (b)
            security, integrity, and privacy of any and all information and data
            exchanged between you and us through this Site cannot be guaranteed.
            <br />
            <br />
            <span style={{ fontWeight: "bold" }}>
              Children Under Thirteen
            </span>{" "}
            <br />
            Cool Neighbors does not knowingly collect personally identifiable
            information from children under the age of thirteen. If you are
            under the age of thirteen, you must ask your parent or guardian for
            permission to use this website.
            <br />
            <br />
            <span style={{ fontWeight: "bold" }}>
              E-mail Communications
            </span>{" "}
            <br />
            From time to time, Cool Neighbors may contact you via email for the
            purpose of providing announcements, promotional offers, alerts,
            confirmations, surveys, and/or other general communication.
            <br />
            <br />
            If you would like to stop receiving marketing or promotional
            communications via email from Cool Neighbors, you may opt out of
            such communications by turning off "Email Notifications" on the
            website's account page.
            <br />
            <br />
            <span style={{ fontWeight: "bold" }}>
              External Data Storage Sites
            </span>{" "}
            <br />
            We may store your data on servers provided by third party hosting
            vendors with whom we have contracted.
            <br />
            <br />
            <span style={{ fontWeight: "bold" }}>
              Collection of your Personal Information
            </span>{" "}
            <br />
            Please keep in mind that if you directly disclose personally
            identifiable information or personally sensitive data through Cool
            Neighbors's public message boards, this information may be collected
            and used by others.
            <br />
            <br />
            We do not collect any personal information about you unless you
            voluntarily provide it to us. However, you may be required to
            provide certain personal information to us when you elect to use
            certain products or services available on the Site. These may
            include: (a) registering for an account on our Site; (b) entering a
            sweepstakes or contest sponsored by us or one of our partners; (c)
            signing up for special offers from selected third parties; (d)
            sending us an email message; (e) submitting your credit card or
            other payment information when ordering and purchasing products and
            services on our Site. To wit, we will use your information for, but
            not limited to, communicating with you in relation to services
            and/or products you have requested from us. We also may gather
            additional personal or non-personal information in the future.
            <br />
            <br />
            <span style={{ fontWeight: "bold" }}>
              Sharing Information with Third Parties
            </span>{" "}
            <br />
            Cool Neighbors does not sell, rent or lease its customer lists to
            third parties.
            <br />
            <br />
            Cool Neighbors may share data with trusted partners to help perform
            statistical analysis, send you email or postal mail, provide
            customer support, or arrange for deliveries. All such third parties
            are prohibited from using your personal information except to
            provide these services to Cool Neighbors, and they are required to
            maintain the confidentiality of your information.
            <br />
            <br />
            Cool Neighbors may disclose your personal information, without
            notice, if required to do so by law or in the good faith belief that
            such action is necessary to: (a) conform to the edicts of the law or
            comply with legal process served on Cool Neighbors or the site; (b)
            protect and defend the rights or property of Cool Neighbors; and/or
            (c) act under exigent circumstances to protect the personal safety
            of users of Cool Neighbors, or the public.
            <br />
            <br />
            <span style={{ fontWeight: "bold" }}>
              Tracking User Behavior
            </span>{" "}
            <br />
            Cool Neighbors may keep track of the websites and pages our users
            visit within Cool Neighbors, in order to determine what Cool
            Neighbors services are the most popular. This data is used to
            deliver customized content and advertising within Cool Neighbors to
            customers whose behavior indicates that they are interested in a
            particular subject area.
            <br />
            <br />
            <span style={{ fontWeight: "bold" }}>
              Changes to this Statement
            </span>{" "}
            <br />
            Cool Neighbors reserves the right to change this Privacy Policy from
            time to time. We will notify you about significant changes in the
            way we treat personal information by sending a notice to the primary
            email address specified in your account, by placing a prominent
            notice on our site, and/or by updating any privacy information on
            this page. Your continued use of the Site and/or Services available
            through this Site after such modifications will constitute your: (a)
            acknowledgment of the modified Privacy Policy; and (b) agreement to
            abide and be bound by that Policy.
            <br />
            <br />
            <span style={{ fontWeight: "bold" }}>Contact Information</span>{" "}
            <br />
            Cool Neighbors welcomes your questions or comments regarding this
            Statement of Privacy. If you believe that Cool Neighbors has not
            adhered to this Statement, please contact Cool Neighbors at:
            <br />
            <br />
            Email Address: zach@coolneighbors.com
            <br />
            <br />
            Effective as of February 15, 2020
            <br />
            <br />
          </div>
          <br />
          <br />
        </IonGrid>
      </IonContent>
      <IonFooter mode="ios" className="ion-text-center footerHeight">
        <IonRow>
          <IonCol className="ion-align-items-center">
            <IonButton
              style={{ marginTop: "10px" }}
              onClick={() => props.setPrivacyModal(false)}
            >
              DONE
            </IonButton>
          </IonCol>
        </IonRow>
      </IonFooter>
    </IonModal>
  );
};

export default PrivacyPolicyModal;
