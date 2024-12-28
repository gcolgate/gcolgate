import pandas as pd
import os
import re

# Passing the TSV file to
# read_csv() function
# with tab separator
# This function will
# read data from file
spells = pd.read_csv("/home/gilcolgate/Downloads/Prittania Spells - Spells.tsv", sep="\t", dtype="str")


index = 0


for row in spells.index:
    baseName = spells["Name"][row].strip()
    if baseName == "":
        continue
    baseName = baseName.replace(" ", "_")
    baseName = baseName.replace("/", "_")
    baseName = baseName.replace("\\", "_")
    print("baseName " + baseName)
    file = "spell_" + baseName
    baseName += ".json"
    path = os.path.join("./", "public", "CompendiumFiles", "spell_" + baseName)
    print("path " + path)
    tag_path = os.path.join("./", "public", "Compendium", "tag_spell_" + baseName)
    print("tag_path " + tag_path)
    tag_f = open(tag_path, "w")

    tag_f.write('{ "file": "CompendiumFiles/' + file + '",')
    tag_f.write('"page": "spell",')
    tag_f.write(' "type": "spell",')
    tag_f.write(' "name": "' + spells["Name"][row].strip() + '",')
    tag_f.write(' "powers":')
    pieces = str(spells["Powers"][row]).split(",")

    tag_f.write("[")
    for index in range(0, len(pieces)):
        pieces[index] = '"' + str(pieces[index]).strip() + '"'
    tag_f.write(" ,".join(pieces))
    tag_f.write("],")
    tag_f.write('"img": "images/questionMark.png"')

    tag_f.write("}")
    tag_f.close()

    f = open(path, "w")
    f.write("{")
    f.write('"image": "images/questionMark.png"')
    for col in spells.columns:
        if pd.isna(spells[col][row]) == False:
            if col == "Powers" or col == "PossibleEnhancements":
                pieces = str(spells[col][row]).split(",")
                f.write("," + '"' + col + '":')
                f.write("[")
                for index in range(0, len(pieces)):
                    pieces[index] = '"' + str(pieces[index]).strip() + '"'
                f.write(" ,".join(pieces))
                f.write("]")

                if col == "PossibleEnhancements":
                    print(col)
                    f.write(',"owner_modified":')
                    f.write("{")
                    comma = False
                    print("PossibleEnhancements")
                    if len(pieces) == 0:
                        print("Error")
                    for index in range(0, len(pieces)):
                        if comma:
                            f.write(",")
                        comma = True
                        f.write(str(pieces[index]).strip() + ":0")
                        print(str(pieces[index]).strip() + ":0")
                    f.write("}")
                else:
                    print("else " + col)

            elif col == "Name":
                f.write(', "name": "' + str(spells[col][row]) + '"')
            elif col == "Damage":
                s = str(spells[col][row])
                print(" Damage " + s)
                if "*" not in s:
                    f.write(', "' + "DamageEffect" + '": "' + s + '"')
                else:
                    pieces = s.split("*")
                    f.write(',  "Damage" : [')
                    comma = False
                    for piece in pieces:
                        print(" piece " + piece)
                        if piece == "":
                            continue
                        if comma:
                            f.write(",")
                        f.write("{")
                        comma = True
                        p = re.split("\s+", piece)
                        if len(p) > 0:
                            f.write(' "damage": "' + p[0] + '"')
                            p.pop(0)
                        if len(p) > 0:
                            f.write(', "type": "' + p[0] + '"')
                            p.pop(0)
                        if len(p) > 0:
                            f.write(', "when": "' + " ".join(p) + '"')
                        f.write("}")
                    f.write("]")

            else:
                f.write(', "' + col + '": "' + str(spells[col][row]) + '"')

    f.write("}")
    f.close()
