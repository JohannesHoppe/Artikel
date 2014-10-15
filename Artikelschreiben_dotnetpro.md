# Artikel in Markdown
## dotnetpro-Vorlage
### Das Dokument führt Sie durch die Formatierungen, die Sie für einen Artikel für die dotnetpro verwenden sollten. 

Ein Artikel in der dotnetpro besteht (von oben nach unten) aus den Absatzformaten Dachzeile, Headline, Vorspann, Lauftext, Zwischenheadlines, Bildunterschriften, Code und Aufzählungen. 

Hinzu kommen noch die Zeichenformate *kurisv* und **Referenz** auf eine Abbildung, ein Listing oder eine Tabelle. 

#### Absatzformate

Ein Absatz wird durch eine Leerzeile erreicht. Die Absatzformate sind so definiert: 

~~~~~
# Das ist eine Dachzeile
## Das ist die Headline
### Das ist der Vorspann

Das ist der Lauftext.

#### Das ist ein Zwischentitel
##### [Abb. 2] Hier steht dann die Bildunterschrift

~~~~~

Daraus wird das:

# -------------------------------

# Das ist eine Dachzeile
## Das ist die Headline
### Das ist der Vorspann

Das ist der Lauftext.

#### Das ist ein Zwischentitel

##### [Abb. 2] Hier steht dann die Bildunterschrift

# -------------------------------

#### Listings und Code

Listings werden *entgegen* dem klassischen Markdown nicht durch Einrücken gekennzeichnet. Für die dotnetpro müssen Sie in zwei Zeilen von je mindestens fünf Tilden eingeschlossen werden. Das sieht also folgendermaßen aus:

~~~~~
string s = "Das ist Code";
~~~~~

Code sowie Klassennamen und Methodennamen wie zum Beispiel die Klasse *File* mit der statischen Methode *File.ReadToEnd()* im Fließtext werden kursiv gesetzt. Dagegen werden Dateinamen **nicht** kursiv gesetzt. 

#### Menüeinträge

Menüs werden von Untermenüs durch einen senkrechten Strich getrennt und kursiv gesetzt.

Klicken Sie auf *Datei | Speichern unter ...*



#### Zeichenformate

Kursiv wird durch Asterixe erreicht, die den Begriff einrahmen. Das schließende Asterix sollte man nicht vergessen. 

~~~~~
Das ist ein *kursivgesetzter* Text. 
Das ist *ebenfalls ein kursivgesetzter* Text. 
Das * funktioniert* auch.
Das *auch *.
~~~~~
wird zu 

Das ist ein *kursivgesetzter* Text. 

Das ist *ebenfalls ein kursivgesetzter* Text. 

Das * funktioniert* auch.

Das *auch *.

Beginnt ein Absatz mit einem kursiven Wort, muss vor dem Asterix ein Leerzeichen stehen. Sonst interpretiert der Converter den Asterix als Aufzählungszeichen. 

Ein Verweis auf eine Abbildung, ein Listing oder eine Tabelle wird mit zwei Asterixen markert (**Abbildung 1**).

#### Besondere Zeichen

Braucht man in einem Absatz zweimal oder mehrfach das Zeichen Asterix "*", dann muss man einen Backslash davor einfügen. 


~~~~~
In diesem Satz mit einem \* und noch einem \* muss man die Asterixe escapen. 
~~~~~

wird zu 

In diesem Satz mit einem \* und noch einem \* muss man die Asterixe escapen. 

#### Tabellen
Nur einfache Tabellen können in Markdown gesetzt werden. Tabellen mit umfangreichem Text, Zellen-Spans (zusammengeschlossene Zellen) müssen im Excel-Format abgegeben werden.

|Apfel|Birne|Clementine|Dattel|Erdbeere|
|Feige|Banane|Heidelbeere|Orange|Mandarine|

##### Tabelle 1: Das Obst im Laden.

