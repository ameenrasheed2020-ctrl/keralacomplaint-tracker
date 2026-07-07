import Navbar from '../../components/Navbar'

const departmentGroups = [
  {
    label: 'Roads, transport, and public works',
    departments: [
      'Public Works Department',
      'Transport Department',
      'Harbour Engineering Department',
      'Local Self Government Department',
    ],
  },
  {
    label: 'Water, power, and sanitation',
    departments: [
      'Water Resources Department',
      'Ground Water Department',
      'Power Department',
      'Environment & Climate Change Department',
      'Local Self Government Department',
    ],
  },
  {
    label: 'Health, food, and welfare',
    departments: [
      'Health & Family Welfare Department',
      'Food and Civil Supplies Department',
      'Social Justice Department',
      'Women & Child Development Department',
      'Scheduled Caste and Scheduled Tribes Development Department',
    ],
  },
  {
    label: 'Education, labour, and public safety',
    departments: [
      'General Education Department',
      'Higher Education Department',
      'Labour and Skills Department',
      'Home Department',
      'Disaster Management Department',
    ],
  },
  {
    label: 'Land, housing, and livelihoods',
    departments: [
      'Revenue Department',
      'Housing Department',
      'Agriculture Development and Farmers Welfare Department',
      'Fisheries Department',
      'Animal Husbandry Department',
      'Dairy Development Department',
    ],
  },
]

const NewComplaint = () => {
  return (
    <>
      <Navbar />
      <main className="page-shell narrow">
        <section className="page-heading">
          <p className="eyebrow">New complaint</p>
          <h1>Submit a complaint to MLA staff</h1>
        </section>

        <form className="panel-form">
          <label htmlFor="title">Complaint title</label>
          <input id="title" type="text" placeholder="Short title" required />

          <label htmlFor="ward">Ward or area</label>
          <input id="ward" type="text" placeholder="Ward 12, Edappally" required />

          <label htmlFor="department">Problem belongs to</label>
          <select id="department" defaultValue="" required>
            <option value="" disabled>Select Kerala department</option>
            {departmentGroups.map((group) => (
              <optgroup label={group.label} key={group.label}>
                {group.departments.map((department) => (
                  <option value={department} key={`${group.label}-${department}`}>
                    {department}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          <label htmlFor="category">Problem type</label>
          <select id="category" defaultValue="" required>
            <option value="" disabled>Select public problem type</option>
            <option>Road damage or potholes</option>
            <option>Drainage or flooding</option>
            <option>Water supply issue</option>
            <option>Street light or power issue</option>
            <option>Waste collection issue</option>
            <option>Health or hospital issue</option>
            <option>Ration or civil supplies issue</option>
            <option>School or education issue</option>
            <option>Land, certificate, or revenue issue</option>
            <option>Public safety or policing issue</option>
            <option>Other public grievance</option>
          </select>

          <label htmlFor="description">Description</label>
          <textarea id="description" rows="6" placeholder="Explain the issue" required />

          <button type="submit">Submit complaint</button>
        </form>
      </main>
    </>
  )
}

export default NewComplaint
