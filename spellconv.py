import pandas as pd
import os

# Passing the TSV file to
# read_csv() function
# with tab separator
# This function will
# read data from file
spells = pd.read_csv("..\Prittania Spells - Spells(2).tsv", sep="\t", dtype="str")


index = 0


for row in spells.index:
    baseName = spells["Name"][row].strip()
    if baseName == "":
        continue
    baseName = baseName.replace(" ", "_")
    baseName = baseName.replace("/", "_")
    baseName = baseName.replace("\\", "_")
    print("baseName " + baseName)
    file = baseName
    baseName += ".json"
    path = os.path.join("./", "public", "CompendiumFiles", baseName)
    print("path " + path)
    tag_path = os.path.join("./", "public", "Compendium", "tag_" + baseName)
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

            else:
                if col == "Name":
                    f.write(', "name": "' + str(spells[col][row]) + '"')
                else:
                    f.write(', "' + col + '": "' + str(spells[col][row]) + '"')

    f.write("}")
    f.close()
