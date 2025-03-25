import React from "react";
import { ScrollView } from "react-native";
import { H1, H2, H3, P } from "~/components/ui/typography";
import { Text } from "~/components/ui/text";

const PrivacyPolicyScreen: React.FC = () => {
  return (
    <ScrollView style={{ padding: 20 }}>
      <H1>Datenschutzerklärung</H1>

      <P>
        <b>Gültig ab: 01. März 2025</b>
      </P>

      <P>
        Diese Datenschutzrichtlinie erläutert, wie Athly (im Folgenden als "wir" oder "uns" bezeichnet) Ihre
        personenbezogenen Daten im Zusammenhang mit Ihrer Nutzung unserer Anwendung Athly (die "App") sammelt,
        speichert, verwendet und schützt. In dieser Richtlinie werden außerdem Ihre Rechte in Bezug auf Ihre
        personenbezogenen Daten und die Vorgehensweisen erläutert, mit denen wir Ihre Privatsphäre schützen.
      </P>

      <H2>1. Von uns erhobene personenbezogene Daten</H2>

      <P>
        Wir erheben verschiedene Kategorien von personenbezogenen Daten, die sich in von Ihnen bereitgestellte Daten und
        automatisch erhobene Daten unterteilen lassen.
      </P>

      <H3>Von Ihnen bereitgestellte personenbezogene Daten:</H3>

      <P>
        <b>Allgemeine Angaben:</b> Hierzu gehören Ihr Vor- und Nachname, Ihr Geburtstag, Ihr Geschlecht (optional), Ihre
        Größe und Ihr Gewicht. Diese Daten sind notwendig, um Ihnen grundlegende Funktionen der App bereitzustellen.
      </P>
      <P>
        <b>Aktivitätsdaten und Trainingsinformationen:</b> Alle Trainingsdaten, Aktivitätsaufzeichnungen und jegliche
        Informationen, die Sie in die App eingeben, wie z.B. Trainingspläne, Fortschrittsdaten, Notizen und Feedback.
        Diese Daten werden primär lokal auf Ihrem Endgerät gespeichert.
      </P>
      <P>
        <b>Kommunikationsinformationen:</b> Wenn Sie über Supportkanäle mit uns kommunizieren, erfassen und verarbeiten
        wir Ihren Namen, Ihre E-Mail-Adresse und den Inhalt aller von Ihnen gesendeten Nachrichten.
      </P>
      <P>
        <b>Gespräche mit dem KI-Assistenten:</b> Wenn Sie unseren KI-Assistenten in der App verwenden, werden sämtliche
        Konversationen und Eingaben an Google Gemini (im Folgenden als "KI-Assistent-Anbieter" bezeichnet) zur
        Verarbeitung gesendet. Bitte beachten Sie die Datenschutzbestimmungen von Google Gemini für diese
        Datenverarbeitung.
      </P>

      <H3>Automatisch erhobene personenbezogene Daten:</H3>

      <P>
        <b>Protokolldaten:</b> Dabei handelt es sich um Informationen, die Ihr Gerät automatisch sendet, wenn Sie die
        App nutzen. Hierzu gehören die IP-Adresse, Gerätetyp, Betriebssystemversion sowie Datum und Uhrzeit Ihres
        Zugriffs.
      </P>
      <P>
        <b>Nutzungsdetails:</b> Dazu gehören die von Ihnen verwendeten Funktionen und Ihre Aktionen innerhalb der App,
        wie z.B. die Nutzung des KI-Assistenten, die Aufzeichnung von Trainingseinheiten, die Navigation innerhalb der
        App und ähnliche Interaktionen.
      </P>
      <P>
        <b>Geräteinformationen:</b> Dazu gehören Modell und Typ Ihres Geräts, eindeutige Gerätekennungen und
        Informationen zum Betriebssystem.
      </P>
      <P>
        <b>Details zu Ihren In-App-Käufen:</b> Hierzu gehören Angaben zum Zeitpunkt bestimmter Einkäufe und Ihre
        Abonnementdetails, falls zutreffend.
      </P>

      <H2>2. Zwecke der Verarbeitung</H2>

      <P>Wir verarbeiten Ihre personenbezogenen Daten für folgende Zwecke:</P>

      <P>
        <b>Bereitstellung und Aufrechterhaltung der App-Dienste:</b> Dies umfasst die Personalisierung von
        Trainingsplänen, die Ermöglichung der Nutzung des KI-Assistenten und die Bereitstellung aller Kernfunktionen der
        App.
      </P>
      <P>
        <b>Verbesserung und Weiterentwicklung der App:</b> Wir analysieren Nutzungsdaten, um die App zu verbessern, neue
        Funktionen zu entwickeln und das Nutzererlebnis zu optimieren.
      </P>
      <P>
        <b>Kundensupport:</b> Um Ihnen bei Fragen und Problemen behilflich zu sein und auf Ihre Anfragen zu antworten.
      </P>
      <P>
        <b>Bearbeitung von Zahlungen:</b> Zur Abwicklung von In-App-Käufen und Abonnements über Stripe.
      </P>
      <P>
        <b>Kommunikation bezüglich der Dienste:</b> Um Ihnen wichtige Informationen zur App zu senden, wie z.B.
        Service-E-Mails, Aktualisierungen der Datenschutzrichtlinie oder Nutzungsbedingungen.
      </P>
      <P>
        <b>Missbrauchsprävention und Sicherheit:</b> Um die Sicherheit der App zu gewährleisten und Missbrauch zu
        verhindern.
      </P>

      <H2>3. Rechtsgrundlagen für die Verarbeitung</H2>

      <P>Die Verarbeitung Ihrer personenbezogenen Daten erfolgt auf Basis der folgenden Rechtsgrundlagen:</P>

      <P>
        <b>Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO):</b> Die Verarbeitung Ihrer allgemeinen Angaben,
        Aktivitätsdaten und Nutzungsdetails ist erforderlich, um Ihnen die App-Dienste gemäß den Nutzungsbedingungen
        bereitzustellen.
      </P>
      <P>
        <b>Einwilligung (Art. 6 Abs. 1 lit. a DSGVO):</b> Die Nutzung des KI-Assistenten und die damit verbundene
        Übermittlung Ihrer Konversationen an Google Gemini erfolgt auf Grundlage Ihrer ausdrücklichen Einwilligung, die
        Sie im Rahmen der Nutzungsbedingungen erteilen. Sie können diese Einwilligung jederzeit widerrufen, indem Sie
        die Nutzung des KI-Assistenten einstellen.
      </P>
      <P>
        <b>Berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO):</b> Die Verarbeitung von Protokolldaten, Nutzungsdetails
        und Geräteinformationen zur Verbesserung der App, zur Fehlerbehebung und zur Gewährleistung der Sicherheit der
        App basiert auf unserem berechtigten Interesse, eine funktionierende und sichere App anzubieten. Ebenso basiert
        die Verarbeitung von Daten zur Zahlungsabwicklung über Stripe auf unserem berechtigten Interesse, sichere und
        effiziente Zahlungsmethoden anzubieten.
      </P>
      <P>
        <b>Gesetzliche Verpflichtung (Art. 6 Abs. 1 lit. c DSGVO):</b> In Einzelfällen kann die Verarbeitung von Daten
        erforderlich sein, um gesetzlichen Verpflichtungen nachzukommen, beispielsweise im Rahmen von Auskunftsersuchen
        von Behörden.
      </P>

      <H2>4. Datenschutzrechte</H2>

      <P>Sie haben als Nutzer der Athly-App folgende Datenschutzrechte:</P>

      <P>
        <b>Recht auf Auskunft (Art. 15 DSGVO):</b> Sie haben das Recht, Auskunft über die von uns verarbeiteten
        personenbezogenen Daten zu erhalten.
      </P>
      <P>
        <b>Recht auf Berichtigung (Art. 16 DSGVO):</b> Sie haben das Recht, unrichtige personenbezogene Daten
        berichtigen zu lassen.
      </P>
      <P>
        <b>Recht auf Löschung (Art. 17 DSGVO):</b> Sie haben das Recht, die Löschung Ihrer personenbezogenen Daten zu
        verlangen, sofern die gesetzlichen Voraussetzungen erfüllt sind.
      </P>
      <P>
        <b>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO):</b> Sie haben das Recht, die Einschränkung der
        Verarbeitung Ihrer personenbezogenen Daten zu verlangen, z.B. wenn die Richtigkeit der Daten bestritten wird.
      </P>
      <P>
        <b>Recht auf Datenübertragbarkeit (Art. 20 DSGVO):</b> Sie haben das Recht, Ihre personenbezogenen Daten in
        einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten und an einen anderen Verantwortlichen zu
        übertragen.
      </P>
      <P>
        <b>Widerspruchsrecht (Art. 21 DSGVO):</b> Sie haben das Recht, gegen die Verarbeitung Ihrer personenbezogenen
        Daten zu widersprechen, soweit die Verarbeitung auf einem berechtigten Interesse beruht.
      </P>
      <P>
        <b>Recht auf Widerruf der Einwilligung (Art. 7 Abs. 3 DSGVO):</b> Sie haben das Recht, eine erteilte
        Einwilligung jederzeit zu widerrufen. Der Widerruf der Einwilligung berührt nicht die Rechtmäßigkeit der
        aufgrund der Einwilligung bis zum Widerruf erfolgten Verarbeitung.
      </P>
      <P>
        <b>Beschwerderecht bei einer Aufsichtsbehörde (Art. 77 DSGVO):</b> Sie haben das Recht, sich bei einer
        Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer personenbezogenen Daten durch uns zu beschweren.
      </P>

      <P>
        Um Ihre Datenschutzrechte auszuüben, können Sie uns unter den im Abschnitt "Kontakt" angegebenen Kontaktdaten
        erreichen.
      </P>

      <H2>5. Aufbewahrung personenbezogener Daten</H2>

      <P>
        <b>Lokale Daten:</b> Aktivitätsdaten und Trainingsinformationen, die lokal auf Ihrem Gerät gespeichert werden,
        verbleiben dort, bis Sie die App deinstallieren oder die Daten innerhalb der App löschen.
      </P>
      <P>
        <b>Externe Daten (Google Gemini):</b> Die Aufbewahrungsdauer der an Google Gemini übermittelten
        Chat-Konversationen richtet sich nach den Datenschutzbestimmungen von Google Gemini. Wir haben hierauf keinen
        direkten Einfluss. Bitte informieren Sie sich in den Datenschutzbestimmungen von Google Gemini über die dortigen
        Aufbewahrungsfristen.
      </P>
      <P>
        <b>Nutzerdaten (Athly-Server):</b> Ihre allgemeinen Angaben und andere extern verarbeitete Nutzerdaten werden
        grundsätzlich so lange gespeichert, wie Ihr Konto aktiv ist und für die in dieser Datenschutzerklärung genannten
        Zwecke erforderlich. Nach Löschung Ihres Kontos werden diese Daten vollständig gelöscht, es sei denn, eine
        längere Aufbewahrung ist aufgrund gesetzlicher Aufbewahrungspflichten oder zur Geltendmachung, Ausübung oder
        Verteidigung von Rechtsansprüchen erforderlich.
      </P>

      <H2>6. Sicherheitsmaßnahmen</H2>

      <P>
        <b>Hinweis:</b> Athly nimmt den Schutz Ihrer personenbezogenen Daten ernst.{" "}
        <b>
          Aktuell sind jedoch noch keine umfassenden technischen und organisatorischen Sicherheitsmaßnahmen
          implementiert, um Ihre Daten angemessen zu schützen.
        </b>{" "}
        Wir arbeiten daran, geeignete Maßnahmen zu implementieren, um Ihre Daten vor unbefugtem Zugriff, Verlust,
        Missbrauch oder Zerstörung zu schützen. Sobald entsprechende Sicherheitsmaßnahmen implementiert sind, werden wir
        diese Datenschutzerklärung entsprechend aktualisieren.
      </P>

      <H2>7. Weitergabe personenbezogener Daten</H2>

      <P>Wir geben Ihre personenbezogenen Daten nur in den nachfolgend beschriebenen Fällen an Dritte weiter:</P>

      <P>
        <b>KI-Assistent (Google Gemini):</b> Zur Bereitstellung des KI-Chat-Features werden Ihre Chat-Konversationen an
        Google Gemini übermittelt.
      </P>
      <P>
        <b>Zahlungsabwickler (Stripe):</b> Zur Abwicklung von Zahlungen geben wir die für die Zahlungsabwicklung
        erforderlichen Daten an Stripe weiter.
      </P>
      <P>
        <b>Hosting-Anbieter:</b> Wir nutzen Hosting-Dienste von Supabase, um die App und zugehörige Daten zu hosten.
      </P>
      <P>
        <b>Rechtliche Verpflichtungen:</b> In bestimmten Fällen können wir verpflichtet sein, Ihre personenbezogenen
        Daten an Behörden oder Gerichte weiterzugeben, wenn dies gesetzlich vorgeschrieben ist.
      </P>

      <P>
        Eine Weitergabe Ihrer personenbezogenen Daten an Dritte zu Werbezwecken oder ähnlichen kommerziellen Zwecken
        erfolgt nicht.
      </P>

      <H2>8. Kinder</H2>

      <P>
        Unsere App richtet sich nicht an Kinder unter 18 Jahren und ist nicht für deren Nutzung bestimmt. Wenn Sie
        Kenntnis davon erhalten, dass ein Kind unter 18 Jahren unsere App nutzt, kontaktieren Sie uns bitte umgehend,
        damit wir die erforderlichen Maßnahmen ergreifen können, um die Daten des Kindes zu löschen.
      </P>

      <H2>9. Änderungen dieser Datenschutzerklärung</H2>

      <P>
        Wir behalten uns vor, diese Datenschutzerklärung von Zeit zu Zeit zu ändern oder zu aktualisieren. Die jeweils
        aktuelle Version wird in der App veröffentlicht. Wesentliche Änderungen, die Ihre Rechte beeinträchtigen können,
        werden Ihnen rechtzeitig mitgeteilt, z.B. per In-App-Benachrichtigung oder E-Mail.
      </P>

      <H2>10. Kontakt</H2>

      <P>Für Fragen oder Anliegen zum Datenschutz in Zusammenhang mit unserer App können Sie sich an uns wenden:</P>

      <P>
        Athly
        <br />
        Eren Demir
        <br />
        Glasstraße, 7a
        <br />
        50823 Köln
        <br />
        Deutschland
      </P>
      <P>
        E-Mail: <Text style={{ textDecorationLine: "underline" }}>info@athly.de</Text>
      </P>
    </ScrollView>
  );
};

export default PrivacyPolicyScreen;
