import React from "react";
import { View } from "react-native";
import { H2, Large, Muted, P, H3 } from "../ui/typography";
import { Text } from "../ui/text";

export type TermsOfServiceProps = {
  showHeader?: boolean;
};

const TermsOfService: React.FC<TermsOfServiceProps> = ({ showHeader = true }) => {
  return (
    <View className="flex-1 p-1 pt-0 mt-0 bg-card gap-4">
      <View className="mb-6">
        {showHeader && <H2>Nutzungsbedingungen</H2>}
        <Muted>Gültig ab: 25. März 2025</Muted>
      </View>

      <H3>1. Einleitung</H3>
      <View className="gap-3 mb-6">
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

      <H3>2. Registrierung und Teilnahmeberechtigung</H3>
      <View className="gap-3 mb-6">
        <Large className="mt-3 mb-0">Mindestalter:</Large>
        <P>Zur Nutzung der Athly App müssen Sie mindestens 18 Jahre alt sein.</P>
        <Large className="mt-3 mb-0">Anmeldung:</Large>
        <P>
          Für die Nutzung aller Funktionen der App ist eine Registrierung erforderlich. Sie verpflichten sich, bei der
          Registrierung wahrheitsgemäße und vollständige Angaben zu machen und Ihre Zugangsdaten nicht an Dritte
          weiterzugeben. Werden unrichtige Angaben gemacht oder wird gegen diese Bedingungen verstoßen, behalten wir uns
          vor, den Zugang zur App einzuschränken oder zu beenden.
        </P>
      </View>

      <H3>3. Wichtige Haftungsausschlüsse</H3>
      <View className="gap-3 mb-6">
        <P>Die Nutzung der Athly App erfolgt ausschließlich auf eigenes Risiko. Insbesondere beachten Sie bitte:</P>
        <Large className="mt-3 mb-0">A. Allgemeiner Haftungsausschluss</Large>
        <P>
          Die App dient ausschließlich der Bereitstellung von automatisiert generierten, KI-gestützten
          Trainingsprogrammen. Sie ersetzen niemals den persönlichen ärztlichen Rat oder individuelle
          Trainingsanweisungen.
        </P>
        <Large className="mt-3 mb-0">B. Haftungsausschluss für Trainingsprogramme</Large>
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
        <Large className="mt-3 mb-0">C. Medizinischer Haftungsausschluss</Large>
        <P>
          Mit der Nutzung der App bestätigen Sie, dass Sie sich in gesundheitlich weitgehend einwandfreiem Zustand
          befinden und für körperliche Belastungen selbst verantwortlich sind.
        </P>
        <P>
          Falls Sie unter Vorerkrankungen leiden oder sich unsicher fühlen, konsultieren Sie bitte vor der
          Inanspruchnahme der Trainingsprogramme einen Arzt.
        </P>
      </View>

      <H3>4. Nutzung unserer Dienste</H3>
      <View className="gap-3 mb-6">
        <Large className="mt-3 mb-0">Allgemeine Nutzung:</Large>
        <P>
          Sie verpflichten sich, die Athly App ausschließlich zur persönlichen und nicht-kommerziellen Nutzung zu
          verwenden. Jede missbräuchliche oder rechtswidrige Nutzung, insbesondere das Zurückentwickeln, Dekompilieren
          oder die unbefugte Weitergabe von Inhalten, ist untersagt.
        </P>
        <Large className="mt-3 mb-0">Datenschutz:</Large>
        <P>
          Details zur Erhebung, Speicherung und Verarbeitung personenbezogener Daten entnehmen Sie bitte unserer
          separaten Datenschutzerklärung. Dort wird insbesondere erklärt, inwieweit Daten, wie beispielsweise Angaben zu
          Ihrer Person oder Nutzungsdaten, verarbeitet werden.
        </P>
        <Large className="mt-3 mb-0">Verhaltensregeln:</Large>
        <P>
          Es ist untersagt, Inhalte in die App einzustellen oder zu übermitteln, die gegen geltende Gesetze oder Rechte
          Dritter verstoßen. Ebenso dürfen Sie die App nicht dazu nutzen, um rechtswidrige Handlungen zu begehen.
        </P>
      </View>

      <H3>5. Abonnements</H3>
      <View className="gap-3 mb-6">
        <P>Athly bietet sowohl Testphasen als auch kostenpflichtige Abonnements an.</P>
        <Large className="mt-3 mb-0">Testphase:</Large>
        <P>
          Falls eine kostenlose Testphase angeboten wird, erfolgt dies ausdrücklich und wird auf der Kaufseite bzw. im
          Zahlungsdialog deutlich kommuniziert.
        </P>
        <Large className="mt-3 mb-0">Kostenpflichtige Abonnements:</Large>
        <P>
          Nach Ablauf einer Testphase (sofern angeboten) oder direkt bei Abschluss eines kostenpflichtigen Abonnements
          werden Ihnen die festgelegten Gebühren in Rechnung gestellt. Die entstehenden Kosten werden über Stripe oder
          den Apple App Store abgerechnet – je nachdem, welche Zahlungsmethode Sie wählen.
        </P>
        <Large className="mt-3 mb-0">Automatische Verlängerung:</Large>
        <P>
          Abonnements verlängern sich automatisch um den jeweils gewählten Zeitraum (z. B. monatlich oder jährlich),
          sofern sie nicht fristgerecht gekündigt werden.
        </P>
        <Large className="mt-3 mb-0">Kündigung:</Large>
        <P>
          Um eine automatische Verlängerung zu verhindern, müssen Sie das Abonnement mindestens 24 Stunden vor Ablauf
          des aktuellen Zahlungszeitraums kündigen. Bei Abonnements, die über den Apple App Store abgeschlossen wurden,
          haben Sie die Möglichkeit, die automatische Verlängerung in den entsprechenden Einstellungen zu deaktivieren.
          Eine Kündigung über die App selbst beendet nicht das bestehende Abonnement – die Nutzung bleibt bis zum Ende
          des aktuellen Zahlungszeitraums weiterhin möglich.
        </P>
        <Large className="mt-3 mb-0">Rückerstattungen:</Large>
        <P>
          Rückerstattungsansprüche richten sich nach den geltenden gesetzlichen Regelungen und den Bestimmungen der
          jeweiligen Zahlungsanbieter.
        </P>
      </View>

      <H3>6. Lizenz</H3>
      <View className="gap-3 mb-6">
        <Large className="mt-3 mb-0">Nutzungsrecht:</Large>
        <P>
          Athly gewährt Ihnen eine persönliche, nicht übertragbare, nicht ausschließliche und widerrufliche Lizenz zur
          Nutzung der App ausschließlich für Ihren privaten, nicht-kommerziellen Gebrauch.
        </P>
        <Large className="mt-3 mb-0">Eigentumsrechte:</Large>
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

      <H3>7. Schadloshaltung</H3>
      <View className="gap-3 mb-6">
        <P>
          Sie erklären sich damit einverstanden, Athly, seine Geschäftsführer, Mitarbeiter und sonstige Beauftragte von
          sämtlichen Ansprüchen Dritter freizustellen, die aus einer Verletzung dieser Nutzungsbedingungen oder aus
          einer unbefugten Nutzung der App durch Sie resultieren.
        </P>
      </View>

      <H3>8. Nutzung auf eigene Gefahr</H3>
      <View className="gap-3 mb-6">
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

      <H3>9. Gewährleistungsausschluss</H3>
      <View className="gap-3 mb-6">
        <Large className="mt-3 mb-0">"Wie besehen":</Large>
        <P>
          Die Athly App wird ohne jegliche ausdrückliche oder stillschweigende Gewährleistungen, insbesondere
          hinsichtlich der Funktionsfähigkeit, Genauigkeit oder Eignung für bestimmte Zwecke bereitgestellt.
        </P>
        <Large className="mt-3 mb-0">Inhalte Dritter:</Large>
        <P>Sollten Inhalte von Dritten in der App zugänglich sein, so übernehmen wir hierfür keine Gewähr.</P>
      </View>

      <H3>10. Haftungsbeschränkung</H3>
      <View className="gap-3 mb-6">
        <Large className="mt-3 mb-0">Haftungsumfang:</Large>
        <P>
          In keinem Fall haftet Athly für indirekte, zufällige, spezielle oder Folgeschäden (einschließlich entgangenen
          Gewinns oder Datenverlusts), selbst wenn Athly auf die Möglichkeit solcher Schäden hingewiesen wurde.
        </P>
        <Large className="mt-3 mb-0">Haftungsbegrenzung:</Large>
        <P>
          Soweit gesetzlich zulässig, ist die Gesamthaftung von Athly für alle Ansprüche aus der Nutzung der App auf den
          Betrag begrenzt, den Sie für die Nutzung der App gezahlt haben – maximal jedoch 100 €.
        </P>
      </View>

      <H3>11. Export- und Wirtschaftssanktionskontrolle</H3>
      <View className="gap-3 mb-6">
        <P>
          Die Software und Inhalte der Athly App unterliegen den einschlägigen deutschen Exportbestimmungen. Mit der
          Nutzung der App versichern Sie, dass Sie nicht in einem Land ansässig sind, für das besondere Export- oder
          Wirtschaftssanktionsregelungen gelten, soweit dies gesetzlich vorgeschrieben ist.
        </P>
      </View>

      <H3>12. Dienste und Links Dritter</H3>
      <View className="gap-3 mb-6">
        <P>
          Die Athly App kann Links zu Websites, Apps oder anderen Diensten Dritter enthalten. Wir haben keinen Einfluss
          auf deren Inhalte und übernehmen keine Haftung hierfür. Die Nutzung dieser Angebote erfolgt auf eigenes
          Risiko.
        </P>
      </View>

      <H3>13. Ihr Feedback</H3>
      <View className="gap-3 mb-6">
        <P>
          Feedback, das Sie uns über die App oder andere Kanäle übermitteln, gilt als nicht vertraulich. Mit der
          Übermittlung räumen Sie Athly das uneingeschränkte Recht ein, dieses Feedback zu nutzen, zu verwerten, zu
          veröffentlichen und in jeglicher a‑priori sinnvollen Weise zu bearbeiten.
        </P>
      </View>

      <H3>14. Änderungen der Dienste und Bedingungen</H3>
      <View className="gap-3 mb-6">
        <P>
          Athly behält sich das Recht vor, diese Nutzungsbedingungen sowie die Funktionalität der App jederzeit – und,
          soweit gesetzlich zulässig, ohne vorherige gesonderte Benachrichtigung – zu ändern. Änderungen werden mit
          Veröffentlichung in der App wirksam. Ihre fortgesetzte Nutzung der App gilt als Zustimmung zu den jeweils
          aktuellen Bedingungen.
        </P>
      </View>

      <H3>15. Beendigung</H3>
      <View className="gap-3 mb-6">
        <Large className="mt-3 mb-0">Kündigung durch Athly:</Large>
        <P>
          Wir behalten uns vor, Ihren Zugang zur App ohne Vorankündigung zu sperren oder zu beenden, wenn Sie gegen
          diese Nutzungsbedingungen verstoßen.
        </P>
        <Large className="mt-3 mb-0">Beendigung durch den Nutzer:</Large>
        <P>
          Sie können Ihr Abonnement gemäß den unter Abschnitt 4 genannten Kündigungsregelungen beenden. Nach Beendigung
          aller vertraglichen Beziehungen erlöschen sämtliche Ihnen eingeräumten Rechte zur Nutzung der App.
        </P>
      </View>

      <H3>16. Salvatorische Klausel</H3>
      <View className="gap-3 mb-6">
        <P>
          Sollte eine Bestimmung dieser Nutzungsbedingungen unwirksam sein oder werden, bleibt die Wirksamkeit der
          übrigen Bestimmungen unberührt. Anstelle der unwirksamen Bestimmung gilt eine dem wirtschaftlichen Zweck
          möglichst nahekommende Regelung als vereinbart.
        </P>
      </View>

      <H3>17. Urheberrechtsansprüche</H3>
      <View className="gap-3 mb-6">
        <P>
          Sollten Sie der Ansicht sein, dass in der Athly App durch Urheberrechtsverletzungen geschützte Materialien
          unbefugt verwendet werden, kontaktieren Sie uns bitte unter den nachstehenden Kontaktdaten. Bitte übermitteln
          Sie uns dazu:
        </P>
        <P>Eine genaue Beschreibung des beanstandeten Werkes,</P>
        <P>Angaben zum Ort des mutmaßlichen Verstoßes,</P>
        <P>Ihre Kontaktdaten zur Weiterverfolgung der Angelegenheit.</P>
      </View>

      <H3>18. Streitbeilegung</H3>
      <View className="gap-3 mb-6">
        <Large className="mt-3 mb-0">Anwendbares Recht:</Large>
        <P>Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des internationalen Privatrechts.</P>
        <Large className="mt-3 mb-0">Gerichtsstand:</Large>
        <P>
          Sofern gesetzlich zulässig, vereinbaren wir als ausschließlichen Gerichtsstand für Streitigkeiten, die sich
          aus oder im Zusammenhang mit diesen Nutzungsbedingungen ergeben, den Sitz von Athly in Köln.
        </P>
        <Large className="mt-3 mb-0">Hinweis für Verbraucher:</Large>
        <P>Sofern Sie Verbraucherin oder Verbraucher sind, bleiben Ihre gesetzlichen Rechte unberührt.</P>
      </View>

      <H3>19. Sonstiges</H3>
      <View className="gap-3 mb-6">
        <Large className="mt-3 mb-0">Gesamte Vereinbarung:</Large>
        <P>
          Diese Nutzungsbedingungen stellen die gesamte Vereinbarung zwischen Ihnen und Athly in Bezug auf die Nutzung
          der App dar.
        </P>
        <Large className="mt-3 mb-0">Kein Verzicht:</Large>
        <P>
          Das Versäumnis von Athly, einzelne Rechte oder Bestimmungen durchzusetzen, stellt keinen Verzicht auf diese
          Rechte oder Bestimmungen dar.
        </P>
        <Large className="mt-3 mb-0">Schriftform:</Large>
        <P>Änderungen oder Ergänzungen dieser Vereinbarung bedürfen der Schriftform.</P>
      </View>

      <H3>20. Kontaktdaten</H3>
      <View className="gap-3 mb-6">
        <P>
          Falls Sie Fragen, Anmerkungen oder Beanstandungen zu diesen Nutzungsbedingungen haben, erreichen Sie uns
          unter:
        </P>
        <P>Athly</P>
        <P>Glasstraße 7a</P>
        <P>50823 Köln</P>
        <P>Deutschland</P>
        <P>E-Mail: info@athly.de</P>
      </View>
    </View>
  );
};

export default TermsOfService;
