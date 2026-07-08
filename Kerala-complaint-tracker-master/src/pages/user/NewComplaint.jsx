import { useTranslation } from 'react-i18next'
import Navbar from '../../components/Navbar'

const NewComplaint = () => {
  const { t } = useTranslation()

  const departments = t('newComplaint.departments', { returnObjects: true })
  const deptGroups = [
    { label: t('newComplaint.deptGroups.infrastructure'), keys: ['pwd', 'transport', 'harbour', 'lsgd'] },
    { label: t('newComplaint.deptGroups.utilities'), keys: ['water', 'groundwater', 'power', 'environment', 'lsgd'] },
    { label: t('newComplaint.deptGroups.health'), keys: ['health', 'food', 'social', 'women', 'scst'] },
    { label: t('newComplaint.deptGroups.education'), keys: ['education', 'higherEd', 'labour', 'home', 'disaster'] },
    { label: t('newComplaint.deptGroups.land'), keys: ['revenue', 'housing', 'agriculture', 'fisheries', 'animal', 'dairy'] },
  ]

  const problemTypes = [
    t('newComplaint.problemTypes.road'),
    t('newComplaint.problemTypes.drainage'),
    t('newComplaint.problemTypes.water'),
    t('newComplaint.problemTypes.streetlight'),
    t('newComplaint.problemTypes.waste'),
    t('newComplaint.problemTypes.health'),
    t('newComplaint.problemTypes.ration'),
    t('newComplaint.problemTypes.education'),
    t('newComplaint.problemTypes.land'),
    t('newComplaint.problemTypes.safety'),
    t('newComplaint.problemTypes.other'),
  ]

  return (
    <>
      <Navbar />
      <main className="page-shell narrow">
        <section className="page-heading">
          <p className="eyebrow">{t('newComplaint.heading')}</p>
          <h1>{t('newComplaint.title')}</h1>
        </section>

        <form className="panel-form">
          <label htmlFor="title">{t('newComplaint.complaintTitle')}</label>
          <input id="title" type="text" placeholder={t('newComplaint.complaintPlaceholder')} required />

          <label htmlFor="ward">{t('newComplaint.ward')}</label>
          <input id="ward" type="text" placeholder={t('newComplaint.wardPlaceholder')} required />

          <label htmlFor="department">{t('newComplaint.department')}</label>
          <select id="department" defaultValue="" required>
            <option value="" disabled>{t('newComplaint.departmentPlaceholder')}</option>
            {deptGroups.map((group) => (
              <optgroup label={group.label} key={group.label}>
                {group.keys.map((key) => (
                  <option value={departments[key]} key={key}>{departments[key]}</option>
                ))}
              </optgroup>
            ))}
          </select>

          <label htmlFor="category">{t('newComplaint.problemType')}</label>
          <select id="category" defaultValue="" required>
            <option value="" disabled>{t('newComplaint.problemTypePlaceholder')}</option>
            {problemTypes.map((type) => (<option key={type}>{type}</option>))}
          </select>

          <label htmlFor="description">{t('newComplaint.description')}</label>
          <textarea id="description" rows="6" placeholder={t('newComplaint.descriptionPlaceholder')} required />

          <button type="submit">{t('newComplaint.submit')}</button>
        </form>
      </main>
    </>
  )
}

export default NewComplaint
