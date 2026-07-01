from itertools import combinations


class DiseaseSimilarity:

    def build(self, registry):

        similarities = {}

        diseases = registry.get_all_diseases()

        for disease in diseases:

            current = set(disease.symptoms)

            ranking = []

            for other in diseases:

                if disease.name == other.name:
                    continue

                other_set = set(other.symptoms)

                score = (
                    len(current & other_set)
                    /
                    len(current | other_set)
                )

                ranking.append(
                    (other.name, score)
                )

            ranking.sort(
                key=lambda x: x[1],
                reverse=True,
            )

            similarities[disease.name] = ranking[:10]

        return similarities