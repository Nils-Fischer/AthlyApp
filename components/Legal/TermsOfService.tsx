import React from "react";
import { ScrollView, View } from "react-native";
import { H1, P } from "../ui/typography";
import { Text } from "../ui/text";

const TermsOfService = () => {
  return (
    <ScrollView className="flex-1 p-4 bg-background">
      <View className="mb-8">
        <H1>Nutzungsbedingungen</H1>
        <P>Gültig ab: 25. März 2025</P>
      </View>

      <View className="mb-6">
        <P>
          <Text>Einleitung</Text>
        </P>
        <P>
          Athly ist eine KI-gestützte Trainings-App, die ihren Nutzerinnen und Nutzern personalisierte
          Trainingsprogramme zur Verfügung stellt. Diese Nutzungsbedingungen regeln den Zugang zur und die Nutzung von
          Athly. Sie gelten ausschließlich für die App (und gegebenenfalls die dazugehörige Landingpage, sofern dies
          wirtschaftlich sinnvoll erscheint) und nicht für weiterführende Webangebote.
        </P>
        <P>
          Bitte lesen Sie diese Bedingungen sorgfältig. Mit dem Zugriff auf und der Nutzung der Athly App erklären Sie
          ausdrücklich Ihr Einverständnis mit den folgenden Bedingungen.
        </P>
      </View>

      <View className="mb-6">
        <P>
          <Text>1. Registrierung und Teilnahmeberechtigung</Text>
        </P>
        <P>
          <Text className="font-semibold">Mindestalter:</Text> Zur Nutzung der Athly App müssen Sie mindestens 18 Jahre
          alt sein.
        </P>
        <P>
          <Text className="font-semibold">Anmeldung:</Text> Für die Nutzung aller Funktionen der App ist eine
          Registrierung erforderlich. Sie verpflichten sich, bei der Registrierung wahrheitsgemäße und vollständige
          Angaben zu machen und Ihre Zugangsdaten nicht an Dritte weiterzugeben. Werden unrichtige Angaben gemacht oder
          wird gegen diese Bedingungen verstoßen, behalten wir uns vor, den Zugang zur App einzuschränken oder zu
          beenden.
        </P>
      </View>

      <View className="mb-6">
        <P>
          <Text>2. Wichtige Haftungsausschlüsse</Text>
        </P>
        <P>Die Nutzung der Athly App erfolgt ausschließlich auf eigenes Risiko. Insbesondere beachten Sie bitte:</P>
        <P>
          <Text className="font-semibold">A. Allgemeiner Haftungsausschluss</Text>
        </P>
        <P>
          Die App dient ausschließlich der Bereitstellung von automatisiert generierten, KI-gestützten
          Trainingsprogrammen. Sie ersetzen niemals den persönlichen ärztlichen Rat oder individuelle
          Trainingsanweisungen.
        </P>
        <P>
          <Text className="font-semibold">B. Haftungsausschluss für Trainingsprogramme</Text>
        </P>
        <P>
          Die von Athly bereitgestellten Trainingsprogramme basieren auf algorithmischen Berechnungen und werden ohne
          persönliche Betreuung erstellt.
        </P>
        <P>
          Vor Beginn eines Trainingsprogramms wird ausdrücklich darauf hingewiesen, sich – insbesondere bei
          gesundheitlichen Problemen oder Unsicherheiten – vorab ärztlich beraten zu lassen.
        </P>
        <P>
          Sie übernehmen das volle Risiko einer etwaigen Verletzung oder Verschlechterung Ihres Gesundheitszustandes.
          Athly haftet nicht für direkte oder indirekte Schäden, die aus der Nutzung der Trainingsprogramme entstehen.
        </P>
        <P>
          <Text className="font-semibold">C. Medizinischer Haftungsausschluss</Text>
        </P>
        <P>
          Mit der Nutzung der App bestätigen Sie, dass Sie sich in gesundheitlich weitgehend einwandfreiem Zustand
          befinden und für körperliche Belastungen selbst verantwortlich sind.
        </P>
        <P>
          Falls Sie unter Vorerkrankungen leiden oder sich unsicher fühlen, konsultieren Sie bitte vor der
          Inanspruchnahme der Trainingsprogramme einen Arzt.
        </P>
      </View>

      <View className="mb-6">
        <P>
          <Text>3. Nutzung unserer Dienste</Text>
        </P>
        <P>
          <Text className="font-semibold">Allgemeine Nutzung:</Text>
        </P>
        <P>
          Sie verpflichten sich, die Athly App ausschließlich zur persönlichen und nicht-kommerziellen Nutzung zu
          verwenden. Jede missbräuchliche oder rechtswidrige Nutzung, insbesondere das Zurückentwickeln, Dekompilieren
          oder die unbefugte Weitergabe von Inhalten, ist untersagt.
        </P>
        <P>
          <Text className="font-semibold">Datenschutz:</Text>
        </P>
        <P>
          Details zur Erhebung, Speicherung und Verarbeitung personenbezogener Daten entnehmen Sie bitte unserer
          separaten Datenschutzerklärung. Dort wird insbesondere erklärt, inwieweit Daten, wie beispielsweise Angaben zu
          Ihrer Person oder Nutzungsdaten, verarbeitet werden.
        </P>
        <P>
          <Text className="font-semibold">Verhaltensregeln:</Text>
        </P>
        <P>
          Es ist untersagt, Inhalte in die App einzustellen oder zu übermitteln, die gegen geltende Gesetze oder Rechte
          Dritter verstoßen. Ebenso dürfen Sie die App nicht dazu nutzen, um rechtswidrige Handlungen zu begehen.
        </P>
      </View>

      <View className="mb-6">
        <P>
          <Text>4. Abonnements</Text>
        </P>
        <P>Athly bietet sowohl Testphasen als auch kostenpflichtige Abonnements an.</P>
        <P>
          <Text className="font-semibold">Testphase:</Text>
        </P>
        <P>
          Falls eine kostenlose Testphase angeboten wird, erfolgt dies ausdrücklich und wird auf der Kaufseite bzw. im
          Zahlungsdialog deutlich kommuniziert.
        </P>
        <P>
          <Text className="font-semibold">Kostenpflichtige Abonnements:</Text>
        </P>
        <P>
          Nach Ablauf einer Testphase (sofern angeboten) oder direkt bei Abschluss eines kostenpflichtigen Abonnements
          werden Ihnen die festgelegten Gebühren in Rechnung gestellt. Die entstehenden Kosten werden über Stripe oder
          den Apple App Store abgerechnet – je nachdem, welche Zahlungsmethode Sie wählen.
        </P>
        <P>
          <Text className="font-semibold">Automatische Verlängerung:</Text>
        </P>
        <P>
          Abonnements verlängern sich automatisch um den jeweils gewählten Zeitraum (z. B. monatlich oder jährlich),
          sofern sie nicht fristgerecht gekündigt werden.
        </P>
        <P>
          <Text className="font-semibold">Kündigung:</Text>
        </P>
        <P>
          Um eine automatische Verlängerung zu verhindern, müssen Sie das Abonnement mindestens 24 Stunden vor Ablauf
          des aktuellen Zahlungszeitraums kündigen. Bei Abonnements, die über den Apple App Store abgeschlossen wurden,
          haben Sie die Möglichkeit, die automatische Verlängerung in den entsprechenden Einstellungen zu deaktivieren.
          Eine Kündigung über die App selbst beendet nicht das bestehende Abonnement – die Nutzung bleibt bis zum Ende
          des aktuellen Zahlungszeitraums weiterhin möglich.
        </P>
        <P>
          <Text className="font-semibold">Rückerstattungen:</Text>
        </P>
        <P>
          Rückerstattungsansprüche richten sich nach den geltenden gesetzlichen Regelungen und den Bestimmungen der
          jeweiligen Zahlungsanbieter.
        </P>
      </View>

      <View className="mb-6">
        <P>
          <Text>5. Lizenz</Text>
        </P>
        <P>
          <Text className="font-semibold">Nutzungsrecht:</Text>
        </P>
        <P>
          Athly gewährt Ihnen eine persönliche, nicht übertragbare, nicht ausschließliche und widerrufliche Lizenz zur
          Nutzung der App ausschließlich für Ihren privaten, nicht-kommerziellen Gebrauch.
        </P>
        <P>
          <Text className="font-semibold">Eigentumsrechte:</Text>
        </P>
        <P>
          Alle Inhalte, Grafiken, Texte, Software und sonstige Bestandteile der App sind Eigentum von Athly –
          ausgenommen sind sämtliche von Ihnen bereitgestellte Nutzerdaten, die im alleinigen Eigentum des Nutzers
          verbleiben.
        </P>
        <P>
          Eine Vervielfältigung, Speicherung, Veränderung oder Verbreitung der Inhalte ohne ausdrückliche, schriftliche
          Zustimmung von Athly ist untersagt.
        </P>
      </View>

      <View className="mb-6">
        <P>
          <Text>6. Schadloshaltung</Text>
        </P>
        <P>
          Sie erklären sich damit einverstanden, Athly, seine Geschäftsführer, Mitarbeiter und sonstige Beauftragte von
          sämtlichen Ansprüchen Dritter freizustellen, die aus einer Verletzung dieser Nutzungsbedingungen oder aus
          einer unbefugten Nutzung der App durch Sie resultieren.
        </P>
      </View>

      <View className="mb-6">
        <P>
          <Text>7. Nutzung auf eigene Gefahr</Text>
        </P>
        <P>
          Die Nutzung der Athly App erfolgt ausschließlich auf Ihr eigenes Risiko. Athly übernimmt keine Haftung oder
          Garantie für:
        </P>
        <P>Jegliche gesundheitliche Verbesserungen oder Ergebnisse durch die Nutzung der Trainingsprogramme,</P>
        <P>
          Schäden, Verletzungen oder sonstige Beeinträchtigungen, die sich aus der Anwendung der in der App
          bereitgestellten Inhalte ergeben.
        </P>
      </View>

      <View className="mb-6">
        <P>
          <Text>8. Gewährleistungsausschluss</Text>
        </P>
        <P>
          <Text className="font-semibold">"Wie besehen":</Text>
        </P>
        <P>
          Die Athly App wird ohne jegliche ausdrückliche oder stillschweigende Gewährleistungen, insbesondere
          hinsichtlich der Funktionsfähigkeit, Genauigkeit oder Eignung für bestimmte Zwecke bereitgestellt.
        </P>
        <P>
          <Text className="font-semibold">Inhalte Dritter:</Text>
        </P>
        <P>Sollten Inhalte von Dritten in der App zugänglich sein, so übernehmen wir hierfür keine Gewähr.</P>
      </View>

      <View className="mb-6">
        <P>
          <Text>9. Haftungsbeschränkung</Text>
        </P>
        <P>
          <Text className="font-semibold">Haftungsumfang:</Text>
        </P>
        <P>
          In keinem Fall haftet Athly für indirekte, zufällige, spezielle oder Folgeschäden (einschließlich entgangenen
          Gewinns oder Datenverlusts), selbst wenn Athly auf die Möglichkeit solcher Schäden hingewiesen wurde.
        </P>
        <P>
          <Text className="font-semibold">Haftungsbegrenzung:</Text>
        </P>
        <P>
          Soweit gesetzlich zulässig, ist die Gesamthaftung von Athly für alle Ansprüche aus der Nutzung der App auf den
          Betrag begrenzt, den Sie für die Nutzung der App gezahlt haben – maximal jedoch 100 €.
        </P>
      </View>

      <View className="mb-6">
        <P>
          <Text>10. Export- und Wirtschaftssanktionskontrolle</Text>
        </P>
        <P>
          Die Software und Inhalte der Athly App unterliegen den einschlägigen deutschen Exportbestimmungen. Mit der
          Nutzung der App versichern Sie, dass Sie nicht in einem Land ansässig sind, für das besondere Export- oder
          Wirtschaftssanktionsregelungen gelten, soweit dies gesetzlich vorgeschrieben ist.
        </P>
      </View>

      <View className="mb-6">
        <P>
          <Text>11. Dienste und Links Dritter</Text>
        </P>
        <P>
          Die Athly App kann Links zu Websites, Apps oder anderen Diensten Dritter enthalten. Wir haben keinen Einfluss
          auf deren Inhalte und übernehmen keine Haftung hierfür. Die Nutzung dieser Angebote erfolgt auf eigenes
          Risiko.
        </P>
      </View>

      <View className="mb-6">
        <P>
          <Text>12. Ihr Feedback</Text>
        </P>
        <P>
          Feedback, das Sie uns über die App oder andere Kanäle übermitteln, gilt als nicht vertraulich. Mit der
          Übermittlung räumen Sie Athly das uneingeschränkte Recht ein, dieses Feedback zu nutzen, zu verwerten, zu
          veröffentlichen und in jeglicher a‑priori sinnvollen Weise zu bearbeiten.
        </P>
      </View>

      <View className="mb-6">
        <P>
          <Text>13. Änderungen der Dienste und Bedingungen</Text>
        </P>
        <P>
          Athly behält sich das Recht vor, diese Nutzungsbedingungen sowie die Funktionalität der App jederzeit – und,
          soweit gesetzlich zulässig, ohne vorherige gesonderte Benachrichtigung – zu ändern. Änderungen werden mit
          Veröffentlichung in der App wirksam. Ihre fortgesetzte Nutzung der App gilt als Zustimmung zu den jeweils
          aktuellen Bedingungen.
        </P>
      </View>

      <View className="mb-6">
        <P>
          <Text>14. Beendigung</Text>
        </P>
        <P>
          <Text className="font-semibold">Kündigung durch Athly:</Text>
        </P>
        <P>
          Wir behalten uns vor, Ihren Zugang zur App ohne Vorankündigung zu sperren oder zu beenden, wenn Sie gegen
          diese Nutzungsbedingungen verstoßen.
        </P>
        <P>
          <Text className="font-semibold">Beendigung durch den Nutzer:</Text>
        </P>
        <P>
          Sie können Ihr Abonnement gemäß den unter Abschnitt 4 genannten Kündigungsregelungen beenden. Nach Beendigung
          aller vertraglichen Beziehungen erlöschen sämtliche Ihnen eingeräumten Rechte zur Nutzung der App.
        </P>
      </View>

      <View className="mb-6">
        <P>
          <Text>15. Salvatorische Klausel</Text>
        </P>
        <P>
          Sollte eine Bestimmung dieser Nutzungsbedingungen unwirksam sein oder werden, bleibt die Wirksamkeit der
          übrigen Bestimmungen unberührt. Anstelle der unwirksamen Bestimmung gilt eine dem wirtschaftlichen Zweck
          möglichst nahekommende Regelung als vereinbart.
        </P>
      </View>

      <View className="mb-6">
        <P>
          <Text>16. Urheberrechtsansprüche</Text>
        </P>
        <P>
          Sollten Sie der Ansicht sein, dass in der Athly App durch Urheberrechtsverletzungen geschützte Materialien
          unbefugt verwendet werden, kontaktieren Sie uns bitte unter den nachstehenden Kontaktdaten. Bitte übermitteln
          Sie uns dazu:
        </P>
        <P>Eine genaue Beschreibung des beanstandeten Werkes,</P>
        <P>Angaben zum Ort des mutmaßlichen Verstoßes,</P>
        <P>Ihre Kontaktdaten zur Weiterverfolgung der Angelegenheit.</P>
      </View>

      <View className="mb-6">
        <P>
          <Text>17. Streitbeilegung</Text>
        </P>
        <P>
          <Text className="font-semibold">Anwendbares Recht:</Text>
        </P>
        <P>Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des internationalen Privatrechts.</P>
        <P>
          <Text className="font-semibold">Gerichtsstand:</Text>
        </P>
        <P>
          Sofern gesetzlich zulässig, vereinbaren wir als ausschließlichen Gerichtsstand für Streitigkeiten, die sich
          aus oder im Zusammenhang mit diesen Nutzungsbedingungen ergeben, den Sitz von Athly in Köln.
        </P>
        <P>
          <Text className="font-semibold">Hinweis für Verbraucher:</Text>
        </P>
        <P>Sofern Sie Verbraucherin oder Verbraucher sind, bleiben Ihre gesetzlichen Rechte unberührt.</P>
      </View>

      <View className="mb-6">
        <P>
          <Text>18. Sonstiges</Text>
        </P>
        <P>
          <Text className="font-semibold">Gesamte Vereinbarung:</Text>
        </P>
        <P>
          Diese Nutzungsbedingungen stellen die gesamte Vereinbarung zwischen Ihnen und Athly in Bezug auf die Nutzung
          der App dar.
        </P>
        <P>
          <Text className="font-semibold">Kein Verzicht:</Text>
        </P>
        <P>
          Das Versäumnis von Athly, einzelne Rechte oder Bestimmungen durchzusetzen, stellt keinen Verzicht auf diese
          Rechte oder Bestimmungen dar.
        </P>
        <P>
          <Text className="font-semibold">Schriftform:</Text>
        </P>
        <P>Änderungen oder Ergänzungen dieser Vereinbarung bedürfen der Schriftform.</P>
      </View>

      <View className="mb-6">
        <P>
          <Text>19. Kontaktdaten</Text>
        </P>
        <P>
          Falls Sie Fragen, Anmerkungen oder Beanstandungen zu diesen Nutzungsbedingungen haben, erreichen Sie uns
          unter:
        </P>
        <P>Athly</P>
        <P>Glasstraße 7a</P>
        <P>50823 Köln</P>
        <P>Deutschland</P>
        <P>E-Mail: info@athly.de</P>
        <P>
          <Text className="font-semibold">Abschließende Hinweise</Text>
        </P>
        <P>
          Bitte überprüfen Sie diesen Entwurf sorgfältig und teilen Sie uns mit, ob einzelne Punkte weiter angepasst
          oder ergänzt werden sollen. Insbesondere sollten wir prüfen, ob alle Formulierungen den aktuellen rechtlichen
          Anforderungen im deutschen Verbraucherrecht entsprechen. Beachten Sie, dass insbesondere Klauseln zu Haftung,
          Kündigung und Streitbeilegung regelmäßig einer juristischen Prüfung bedürfen, um konform zu sein.
        </P>
        <P>
          Dies ist ein erster Entwurf, der als Grundlage für die weitere Abstimmung und juristische Prüfung dienen kann.
        </P>
      </View>
    </ScrollView>
  );
};

export default TermsOfService;
