import json
import io

data = []

with io.open('species.txt', 'r', encoding='utf-8') as species_file:
	for line in species_file:
		tokens = line.split('\t')
		scientificName = tokens[1]
		commonName = tokens[2].capitalize()
		category = tokens[3]
		status = tokens[4].strip('\n')
		species = { 'scientificName': scientificName, 'commonName': commonName, 'AERCcategoryPL': category, 'statusPL': status }
		print(species)
		data.append(species)

with open("species_list.json", "w") as jfile:
    json.dump(data, jfile)

# mongoimport --db birdwatcher --collection species --file species_list.json --jsonArray