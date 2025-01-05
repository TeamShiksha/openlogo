import React from "react";
import styles from "./PrivacyPolicy.module.css";
const PrivacyPolicy = () => {
  return (
    <div
      className={styles.privacyPolicy}
      style={{ padding: "20px", lineHeight: "1.6" }}
    >
      {/* Introduction Section */}
      <section>
        <h2 className={styles.heading}>Openlogo Terms of Services</h2>
        <p className={styles.text}>
          Thank you for choosing OpenLogo! We're excited to have you on board.
          Before you begin using OpenLogo, please take a moment to review our
          Terms of Service carefully. As this agreement is a crucial contract
          between us and our users, we've made every effort to present it
          clearly. To make it more convenient for you, we've provided a concise,
          non-binding summary followed by the complete legal terms.
        </p>
      </section>
      <br />

      {/* Privacy Policy Section */}
      <section>
        <h2 className={styles.heading}>Privacy Policy</h2>
        <p className={styles.text}>
          This Privacy Policy explains how Openlogo collects, uses, and protects
          your personal information when you use our website and services. By
          using Openlogo's services, you agree to the terms of this Privacy
          Policy. Your privacy is important to us, and we are committed to
          safeguarding your personal information.
        </p>
        <p className={styles.text}>
          Openlogo collects personal information such as your name, email
          address, and other details when you register for an account or make
          use of specific features on our platform. We also gather usage data
          about how you interact with our website and services, including pages
          viewed, features used, and your activity within our platform. If you
          contact us for support or inquiries, we may collect the content of
          those communications.
        </p>
        <p className={styles.text}>
          The information collected is used to provide and enhance our services,
          manage your account, communicate with you about updates, offers, and
          newsletters, and perform business analysis to optimize site
          performance and security. We may also use your information to
          personalize your experience on Openlogo and improve our services based
          on your preferences.
        </p>
        <p className={styles.text}>
          Openlogo employs cookies and similar technologies to monitor usage
          patterns, improve functionality, and analyze website traffic. Cookies
          help us provide a more personalized user experience. You can manage
          your cookie settings through your browser, but please note that
          disabling certain cookies may affect some features of the website and
          services. For more information on cookies and how to manage them,
          please visit our Cookie Policy.
        </p>
        <p className={styles.text}>
          We take reasonable precautions to protect your personal data from
          unauthorized access, disclosure, alteration, and destruction. However,
          no method of data transmission over the internet or electronic storage
          is 100% secure. While we strive to use commercially acceptable means
          to protect your personal information, we cannot guarantee its absolute
          security. We retain your personal data only as long as necessary to
          fulfill its purposes or as required by law.
        </p>
        <p className={styles.text}>
          Openlogo's services are not intended for children under 13, and we do
          not knowingly collect personal information from children under this
          age. If you believe that we have inadvertently collected personal
          information from a child under 13, please contact us immediately, and
          we will take steps to delete such data.
        </p>
        <p className={styles.text}>
          This Privacy Policy may be updated periodically to reflect changes in
          our practices, services, or legal requirements. When updates are made,
          they will be posted on the website, and the effective date will be
          updated accordingly. We encourage you to review this policy regularly
          to stay informed about how we are protecting your personal
          information.
        </p>
      </section>
      <br />

      {/* Terms and Conditions Section */}
      <section>
        <h2 className={styles.heading}>Terms and Conditions</h2>
        <p className={styles.text}>
          By using Openlogo's website and services, you agree to comply with the
          following terms and conditions. You must abide by all applicable laws
          and regulations while using our services. You are responsible for
          maintaining the confidentiality of your account credentials, including
          your password, and for all activities that occur under your account.
        </p>
        <p className={styles.text}>
          Openlogo reserves the right to modify or discontinue services, in
          whole or in part, at any time without prior notice. We are not liable
          for any direct or indirect damages resulting from the use of our
          services, including but not limited to loss of data, loss of revenue,
          or business interruption.
        </p>
        <p className={styles.text}>
          Openlogo may, from time to time, offer promotional codes, discounts,
          or special offers that are subject to additional terms and conditions.
          We reserve the right to cancel or modify any offers at our discretion.
          These offers may be available for limited periods and are subject to
          availability.
        </p>
        <p className={styles.text}>
          You agree not to misuse Openlogo's services, including but not limited
          to engaging in illegal activities, spamming, or violating the
          intellectual property rights of others. Failure to comply with these
          terms may result in the suspension or termination of your account.
        </p>
        <p className={styles.text}>
          Openlogo is not responsible for any third-party services or websites
          linked to our platform. Please read their respective privacy policies
          and terms before engaging with them.
        </p>
        <p className={styles.text}>
          If you have any questions about this Privacy Policy or our Terms and
          Conditions, please contact us through our contact page. We are here to
          help you understand and navigate our policies.
        </p>
      </section>
      <br />
    </div>
  );
};

export default PrivacyPolicy;
