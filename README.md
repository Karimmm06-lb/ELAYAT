# ELAYAT — Institut de Beauté Privée

Site officiel de **ELAYAT**, premier Institut HeadSpa privé d'Algérie.  
Dely Ibrahim, Alger · Sur rendez-vous uniquement · [@elaya_at](https://instagram.com/elaya_at)

---

## Contenu du site

- Hero avec logo et accroche
- Section "L'Institut" avec stats
- Prestations : HeadSpa, Massages, Brow Lift, Cours d'Auto Maquillage
- Système de réservation (à connecter avec Cal.com)
- Avis clients Google (vrais avis)
- Contact + localisation Dely Ibrahim

---

## Mettre le site en ligne (GitHub Pages)

1. Aller dans **Settings** du repo GitHub
2. Cliquer **Pages** dans le menu à gauche
3. Sous "Branch" → sélectionner **`main`** → **`/ (root)`**
4. Cliquer **Save**
5. Le site sera disponible sur : `https://karimmm06-lb.github.io/ELAYAT`

---

## Intégrer Cal.com dans le site

### Étape 1 — Récupérer le lien de l'event sur Cal.com

1. Aller sur [app.cal.com](https://app.cal.com)
2. Cliquer sur l'event souhaité (ex: HeadSpa)
3. Cliquer sur **"Copier le lien de la page publique"**
4. Le lien ressemble à : `https://cal.com/kimo-laabani-5rexl8/HeadSpa`

### Étape 2 — Remplacer le calendrier dans le site

Dans le fichier `index.html`, trouver la section `id="booking"` et remplacer le contenu par :

```html
<section id="booking">
  <div class="booking-wrap">
    <div class="booking-head">
      <span class="label">Réservation</span>
      <h2 class="title">Réservez votre <em>rituel.</em></h2>
      <p class="body-text" style="margin:0 auto;text-align:center">
        Choisissez votre soin et votre créneau directement en ligne.
      </p>
    </div>
    <!-- Remplacer le lien ci-dessous par le vrai lien Cal.com -->
    <div style="text-align:center;margin-top:40px">
      <a href="https://cal.com/kimo-laabani-5rexl8/HeadSpa"
         target="_blank" class="btn-dark">
        Réserver maintenant
      </a>
    </div>
  </div>
</section>
```

### Étape 3 — Ou intégrer Cal.com directement dans la page (embed)

1. Sur Cal.com → event → icône **`< >`** (embed) en haut à droite
2. Choisir **"Inline"**
3. Copier le code et le coller dans `index.html` à la place de la section réservation

---

## Ajouter un nouveau service sur Cal.com

1. Aller sur [app.cal.com](https://app.cal.com) → **Types d'évènements**
2. Cliquer **"Nouvel évènement"**
3. Remplir :
   - **Titre** : nom du service (ex: Brow Lift)
   - **Durée** : durée du soin en minutes
   - **Description** : description + tarif
   - **URL** : slug simple (ex: `brow-lift`)
   - **Lieu** : En personne → `Dely Ibrahim, Alger`
4. Aller dans **Disponibilités** → configurer les jours et heures
5. Cliquer **Enregistrer**

---

## Modifier les tarifs ou textes

Ouvrir `index.html` et chercher (Ctrl+F) le nom du service à modifier.

---

## Services & Tarifs actuels

### HeadSpa
| Service | Durée | Prix |
|---|---|---|
| Mey Experience | 45 min + séchage | 6 500 DA |
| Évasion | 60 min + séchage | 7 500 DA |
| Skin & Care | 80 min + séchage | 9 500 DA |
| Rêve Ultime | 80 min + séchage | 11 000 DA |

### Massages
| Service | Durée | Prix |
|---|---|---|
| Visage & Décolleté | 45 min | 5 000 DA |
| Hair Meditation | 45 min | 5 000 DA |
| Pieds & Mains | 30 min | 3 500 DA |

### Brow Lift
| Service | Prix |
|---|---|
| Restructuration des sourcils | 2 500 DA |
| Henna Tattoo | 2 500 DA |
| Brow Lift | 3 000 DA |
| Brow Lift + Henna Brow | 5 000 DA |
| Brow Lift + Restructuration | 5 000 DA |
| Brow Lift + Henna + Restructuration | 6 000 DA |

### Cours d'Auto Maquillage
| Formule | Durée | Prix |
|---|---|---|
| Formule Essentielle | 2h | 7 000 DA |
| Formule Excellence | 3h | 10 000 DA |

---

## Contact
- Instagram : [@elaya_at](https://instagram.com/elaya_at)
- Adresse : Dely Ibrahim, Alger
