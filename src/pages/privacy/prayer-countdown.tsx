import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";
import Layout from "../../sections/layout";
import { Heading } from "../../components/heading";
import { SEO } from "../../components/seo";

const EFFECTIVE_DATE = "27 September 2026";

const PrayerCountdownPrivacyPage: React.FC<PageProps> = (props) => {
  return (
    <Layout {...props}>
      <div className="flex flex-col items-center w-full mt-32 px-6 pb-24">
        <Heading name="Privacy Policy" />
        <div className="max-w-2xl w-full mt-8 space-y-6 text-lg leading-relaxed">
          <p className="text-sm opacity-70">
            <strong>App:</strong> Prayer Countdown for Wear OS
            <br />
            <strong>Effective date:</strong> {EFFECTIVE_DATE}
            <br />
            <strong>Developer:</strong> Saiid Hajj Chehade
            <br />
            <strong>Contact:</strong>{" "}
            <a href="mailto:saiid.hajj@proton.me" className="underline">
              saiid.hajj@proton.me
            </a>
          </p>

          <section>
            <h2 className="text-2xl font-semibold mb-2">Summary</h2>
            <p>
              Prayer Countdown is a standalone Wear OS app. It does not collect,
              transmit, sell, or share any personal data. Everything the app
              needs stays on your watch.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">
              What the app accesses
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Coarse location.</strong> Used only to compute Islamic
                prayer times for your current city. The coordinates are stored
                locally on the watch (Android DataStore) and never leave the
                device. You can enter a city manually instead.
              </li>
              <li>
                <strong>Notifications.</strong> Required so the app can show
                reminders before each prayer. No notification content is sent
                anywhere.
              </li>
              <li>
                <strong>Exact alarms.</strong> Required so reminders fire at
                the correct minute-before-prayer offsets. No data leaves the
                device.
              </li>
              <li>
                <strong>Vibration and sensors (gyroscope).</strong> The
                gyroscope is only read when a reminder screen is showing, to
                detect the wrist-flick-to-snooze gesture. Readings are
                processed in memory and discarded — nothing is stored or sent.
              </li>
              <li>
                <strong>Background location (optional).</strong> If you grant
                it, the app refreshes prayer times when you travel between
                cities without needing to be opened. If you don't grant it,
                the app still works — it just refreshes on next launch.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">
              What the app does <em>not</em> do
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>No account, no login, no server backend.</li>
              <li>No analytics, tracking, or telemetry.</li>
              <li>No advertising SDKs.</li>
              <li>
                No third-party data sharing. The only network access is the
                one-time reverse-geocoding call Android makes locally to turn
                coordinates into a city name (via the on-device{" "}
                <code>Geocoder</code>
                API — this may reach Google's geocoding service depending on
                the device configuration; the app itself does not initiate any
                other network requests).
              </li>
              <li>No collection of health, financial, contact, or messaging data.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">Data retention</h2>
            <p>
              Location coordinates, city name, and app settings are stored on
              your watch until you uninstall the app or clear its data through
              system settings. There is no cloud copy to retain.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">Children</h2>
            <p>
              The app is not directed at children under 13. No personal data is
              collected from any user.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">Changes</h2>
            <p>
              Any material change to how the app handles data will be reflected
              on this page and, where relevant, in the app's release notes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">Contact</h2>
            <p>
              Questions or concerns:{" "}
              <a href="mailto:saiid.hajj@proton.me" className="underline">
                saiid.hajj@proton.me
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default PrayerCountdownPrivacyPage;

export const Head: HeadFC = () => (
  <SEO>
    <title>saiid.ch | Prayer Countdown — Privacy</title>
    <meta
      name="description"
      content="Privacy policy for the Prayer Countdown Wear OS app."
    />
    <meta name="robots" content="index, follow" />
    <meta
      property="og:title"
      content="Prayer Countdown — Privacy Policy"
    />
    <meta
      property="og:description"
      content="Privacy policy for the Prayer Countdown Wear OS app. No data collection."
    />
    <meta property="og:type" content="website" />
  </SEO>
);
