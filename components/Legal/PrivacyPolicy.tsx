import React from "react";
import { View } from "react-native";
import { H2, Large, Muted, P, H3 } from "../ui/typography";

export type PrivacyPolicyProps = {
  showHeader?: boolean;
};

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ showHeader = true }) => {
  return (
    <View className="flex-1 p-1 pt-0 mt-0 bg-background gap-3">
      <View className="mb-6">
        {showHeader && <H2>Datenschutzerklärung</H2>}
        <Muted>Gültig ab: 01. März 2025</Muted>
      </View>

      <H3>1. Von uns erhobene personenbezogene Daten</H3>
      <View className="gap-3 mb-6">
        <P className="mt-3 mb-1">
          Wir erheben verschiedene Kategorien von personenbezogenen Daten, die sich in von Ihnen bereitgestellte Daten
          und automatisch erhobene Daten unterteilen lassen.
        </P>
        <Large className="mt-3 mb-0">Von Ihnen bereitgestellte personenbezogene Daten:</Large>
        <P>
          <P className="font-semibold">Allgemeine Angaben:</P> Hierzu gehören Ihr Vor- und Nachname, Ihr Geburtstag, Ihr
          Geschlecht (optional), Ihre Größe und Ihr Gewicht. Diese Daten sind notwendig, um Ihnen grundlegende
          Funktionen der App bereitzustellen.
        </P>
        <P>
          <P className="font-semibold">Aktivitätsdaten und Trainingsinformationen:</P> Alle Trainingsdaten,
          Aktivitätsaufzeichnungen und jegliche Informationen, die Sie in die App eingeben, wie z.B. Trainingspläne,
          Fortschrittsdaten, Notizen und Feedback. Diese Daten werden primär lokal auf Ihrem Endgerät gespeichert.
        </P>
        <P>
          <P className="font-semibold">Kommunikationsinformationen:</P> Wenn Sie über Supportkanäle mit uns
          kommunizieren, erfassen und verarbeiten wir Ihren Namen, Ihre E-Mail-Adresse und den Inhalt aller von Ihnen
          gesendeten Nachrichten.
        </P>
        <P>
          <P className="font-semibold">Gespräche mit dem KI-Assistenten:</P> Wenn Sie unseren KI-Assistenten in der App
          verwenden, werden sämtliche Konversationen und Eingaben an Google Gemini (im Folgenden als
          "KI-Assistent-Anbieter" bezeichnet) zur Verarbeitung gesendet. Bitte beachten Sie die Datenschutzbestimmungen
          von Google Gemini für diese Datenverarbeitung.
        </P>
        <Large className="mt-3 mb-0">Automatisch erhobene personenbezogene Daten:</Large>
        <P>
          <P className="font-semibold">Protokolldaten:</P> Dabei handelt es sich um Informationen, die Ihr Gerät
          automatisch sendet, wenn Sie die App nutzen. Hierzu gehören die IP-Adresse, Gerätetyp, Betriebssystemversion
          sowie Datum und Uhrzeit Ihres Zugriffs.
        </P>
        <P>
          <P className="font-semibold">Nutzungsdetails:</P> Dazu gehören die von Ihnen verwendeten Funktionen und Ihre
          Aktionen innerhalb der App, wie z.B. die Nutzung des KI-Assistenten, die Aufzeichnung von Trainingseinheiten,
          die Navigation innerhalb der App und ähnliche Interaktionen.
        </P>
        <P>
          <P className="font-semibold">Geräteinformationen:</P> Dazu gehören Modell und Typ Ihres Geräts, eindeutige
          Gerätekennungen und Informationen zum Betriebssystem.
        </P>
        <P>
          <P className="font-semibold">Details zu Ihren In-App-Käufen:</P> Hierzu gehören Angaben zum Zeitpunkt
          bestimmter Einkäufe und Ihre Abonnementdetails, falls zutreffend.
        </P>
      </View>

      <H3>2. Zwecke der Verarbeitung</H3>
      <View className="gap-3 mb-6">
        <P>Wir verarbeiten Ihre personenbezogenen Daten für folgende Zwecke:</P>
        <P>
          Bereitstellung und Aufrechterhaltung der App-Dienste: Dies umfasst die Personalisierung von Trainingsplänen,
          die Ermöglichung der Nutzung des KI-Assistenten und die Bereitstellung aller Kernfunktionen der App.
        </P>
        <P>
          Verbesserung und Weiterentwicklung der App: Wir analysieren Nutzungsdaten, um die App zu verbessern, neue
          Funktionen zu entwickeln und das Nutzererlebnis zu optimieren.
        </P>
        <P>Kundensupport: Um Ihnen bei Fragen und Problemen behilflich zu sein und auf Ihre Anfragen zu antworten.</P>
        <P>Bearbeitung von Zahlungen: Zur Abwicklung von In-App-Käufen und Abonnements über Stripe.</P>
        <P>
          Kommunikation bezüglich der Dienste: Um Ihnen wichtige Informationen zur App zu senden, wie z.B.
          Service-E-Mails, Aktualisierungen der Datenschutzrichtlinie oder Nutzungsbedingungen.
        </P>
        <P>
          Missbrauchsprävention und Sicherheit: Um die Sicherheit der App zu gewährleisten und Missbrauch zu verhindern.
        </P>
      </View>

      <H3>3. Rechtsgrundlagen für die Verarbeitung</H3>
      <View className="gap-3 mb-6">
        <P>Die Verarbeitung Ihrer personenbezogenen Daten erfolgt auf Basis der folgenden Rechtsgrundlagen:</P>
        <P>
          Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO): Die Verarbeitung Ihrer allgemeinen Angaben, Aktivitätsdaten
          und Nutzungsdetails ist erforderlich, um Ihnen die App-Dienste gemäß den Nutzungsbedingungen bereitzustellen.
        </P>
        <P>
          Einwilligung (Art. 6 Abs. 1 lit. a DSGVO): Die Nutzung des KI-Assistenten und die damit verbundene
          Übermittlung Ihrer Konversationen an Google Gemini erfolgt auf Grundlage Ihrer ausdrücklichen Einwilligung,
          die Sie im Rahmen der Nutzungsbedingungen erteilen. Sie können diese Einwilligung jederzeit widerrufen, indem
          Sie die Nutzung des KI-Assistenten einstellen.
        </P>
        <P>
          Berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO): Die Verarbeitung von Protokolldaten, Nutzungsdetails und
          Geräteinformationen zur Verbesserung der App, zur Fehlerbehebung und zur Gewährleistung der Sicherheit der App
          basiert auf unserem berechtigten Interesse, eine funktionierende und sichere App anzubieten. Ebenso basiert
          die Verarbeitung von Daten zur Zahlungsabwicklung über Stripe auf unserem berechtigten Interesse, sichere und
          effiziente Zahlungsmethoden anzubieten.
        </P>
        <P>
          Gesetzliche Verpflichtung (Art. 6 Abs. 1 lit. c DSGVO): In Einzelfällen kann die Verarbeitung von Daten
          erforderlich sein, um gesetzlichen Verpflichtungen nachzukommen, beispielsweise im Rahmen von
          Auskunftsersuchen von Behörden.
        </P>
      </View>

      <H3>4. Datenschutzrechte</H3>
      <View className="gap-3 mb-6">
        <P>Sie haben als Nutzer der Athly-App folgende Datenschutzrechte:</P>
        <P>
          Recht auf Auskunft (Art. 15 DSGVO): Sie haben das Recht, Auskunft über die von uns verarbeiteten
          personenbezogenen Daten zu erhalten.
        </P>
        <P>
          Recht auf Berichtigung (Art. 16 DSGVO): Sie haben das Recht, unrichtige personenbezogene Daten berichtigen zu
          lassen.
        </P>
        <P>
          Recht auf Löschung (Art. 17 DSGVO): Sie haben das Recht, die Löschung Ihrer personenbezogenen Daten zu
          verlangen, sofern die gesetzlichen Voraussetzungen erfüllt sind.
        </P>
        <P>
          Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO): Sie haben das Recht, die Einschränkung der
          Verarbeitung Ihrer personenbezogenen Daten zu verlangen, z.B. wenn die Richtigkeit der Daten bestritten wird.
        </P>
        <P>
          Recht auf Datenübertragbarkeit (Art. 20 DSGVO): Sie haben das Recht, Ihre personenbezogenen Daten in einem
          strukturierten, gängigen und maschinenlesbaren Format zu erhalten und an einen anderen Verantwortlichen zu
          übertragen.
        </P>
        <P>
          Widerspruchsrecht (Art. 21 DSGVO): Sie haben das Recht, gegen die Verarbeitung Ihrer personenbezogenen Daten
          zu widersprechen, soweit die Verarbeitung auf einem berechtigten Interesse beruht.
        </P>
        <P>
          Recht auf Widerruf der Einwilligung (Art. 7 Abs. 3 DSGVO): Sie haben das Recht, eine erteilte Einwilligung
          jederzeit zu widerrufen. Der Widerruf der Einwilligung berührt nicht die Rechtmäßigkeit der aufgrund der
          Einwilligung bis zum Widerruf erfolgten Verarbeitung.
        </P>
        <P>
          Beschwerderecht bei einer Aufsichtsbehörde (Art. 77 DSGVO): Sie haben das Recht, sich bei einer
          Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer personenbezogenen Daten durch uns zu beschweren.
        </P>
        <P>
          Um Ihre Datenschutzrechte auszuüben, können Sie uns unter den im Abschnitt "Kontakt" angegebenen Kontaktdaten
          erreichen.
        </P>
      </View>

      <H3>5. Aufbewahrung personenbezogener Daten</H3>
      <View className="gap-3 mb-6">
        <Large className="mt-3 mb-0">Lokale Daten:</Large>
        <P>
          Aktivitätsdaten und Trainingsinformationen, die lokal auf Ihrem Gerät gespeichert werden, verbleiben dort, bis
          Sie die App deinstallieren oder die Daten innerhalb der App löschen.
        </P>
        <Large className="mt-3 mb-0">Externe Daten (Google Gemini):</Large>
        <P>
          Die Aufbewahrungsdauer der an Google Gemini übermittelten Chat-Konversationen richtet sich nach den
          Datenschutzbestimmungen von Google Gemini. Wir haben hierauf keinen direkten Einfluss. Bitte informieren Sie
          sich in den Datenschutzbestimmungen von Google Gemini über die dortigen Aufbewahrungsfristen.
        </P>
        <Large className="mt-3 mb-0">Nutzerdaten (Athly-Server):</Large>
        <P>
          Ihre allgemeinen Angaben und andere extern verarbeitete Nutzerdaten werden grundsätzlich so lange gespeichert,
          wie Ihr Konto aktiv ist und für die in dieser Datenschutzerklärung genannten Zwecke erforderlich. Nach
          Löschung Ihres Kontos werden diese Daten vollständig gelöscht, es sei denn, eine längere Aufbewahrung ist
          aufgrund gesetzlicher Aufbewahrungspflichten oder zur Geltendmachung, Ausübung oder Verteidigung von
          Rechtsansprüchen erforderlich.
        </P>
      </View>

      <H3>6. Sicherheitsmaßnahmen</H3>
      <View className="gap-3 mb-6">
        <Large className="mt-3 mb-0">Hinweis:</Large>
        <P>
          Athly nimmt den Schutz Ihrer personenbezogenen Daten ernst. Aktuell sind jedoch noch keine umfassenden
          technische und organisatorische Sicherheitsmaßnahmen implementiert, um Ihre Daten angemessen zu schützen. Wir
          arbeiten daran, geeignete Maßnahmen zu implementieren, um Ihre Daten vor unbefugtem Zugriff, Verlust,
          Missbrauch oder Zerstörung zu schützen. Sobald entsprechende Sicherheitsmaßnahmen implementiert sind, werden
          wir diese Datenschutzerklärung entsprechend aktualisieren.
        </P>
      </View>

      <H3>7. Weitergabe personenbezogener Daten</H3>
      <View className="gap-3 mb-6">
        <P>Wir geben Ihre personenbezogenen Daten nur in den nachfolgend beschriebenen Fällen an Dritte weiter:</P>
        <P>
          KI-Assistent (Google Gemini): Zur Bereitstellung des KI-Chat-Features werden Ihre Chat-Konversationen an
          Google Gemini übermittelt.
        </P>
        <P>
          Zahlungsabwickler (Stripe): Zur Abwicklung von Zahlungen geben wir die für die Zahlungsabwicklung
          erforderlichen Daten an Stripe weiter.
        </P>
        <P>Hosting-Anbieter: Wir nutzen Hosting-Dienste von Supabase, um die App und zugehörige Daten zu hosten.</P>
        <P>
          Rechtliche Verpflichtungen: In bestimmten Fällen können wir verpflichtet sein, Ihre personenbezogenen Daten an
          Behörden oder Gerichte weiterzugeben, wenn dies gesetzlich vorgeschrieben ist.
        </P>
        <P>
          Eine Weitergabe Ihrer personenbezogenen Daten an Dritte zu Werbezwecken oder ähnlichen kommerziellen Zwecken
          erfolgt nicht.
        </P>
      </View>

      <H3>8. Kinder</H3>
      <View className="gap-3 mb-6">
        <P>
          Unsere App richtet sich nicht an Kinder unter 18 Jahren und ist nicht für deren Nutzung bestimmt. Wenn Sie
          Kenntnis davon erhalten, dass ein Kind unter 18 Jahren unsere App nutzt, kontaktieren Sie uns bitte umgehend,
          damit wir die erforderlichen Maßnahmen ergreifen können, um die Daten des Kindes zu löschen.
        </P>
      </View>

      <H3>9. Änderungen dieser Datenschutzerklärung</H3>
      <View className="gap-3 mb-6">
        <P>
          Wir behalten uns vor, diese Datenschutzerklärung von Zeit zu Zeit zu ändern oder zu aktualisieren. Die jeweils
          aktuelle Version wird in der App veröffentlicht. Wesentliche Änderungen, die Ihre Rechte beeinträchtigen
          können, werden Ihnen rechtzeitig mitgeteilt, z.B. per In-App-Benachrichtigung oder E-Mail.
        </P>
      </View>

      <H3>10. Kontakt</H3>
      <View className="gap-0 mb-6">
        <P className="my-3">
          Für Fragen oder Anliegen zum Datenschutz in Zusammenhang mit unserer App können Sie sich an uns wenden:
        </P>
        <P>Athly</P>
        <P>Eren Demir</P>
        <P>Glasstraße, 7a</P>
        <P>50823 Köln</P>
        <P>Deutschland</P>
        <P>E-Mail: info@athly.de</P>
      </View>
    </View>
  );
};

export default PrivacyPolicy;
