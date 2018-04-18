const TypeSlidder = 0
const TypeMultiSelect = 1
const TypeSelect = 2

export const questionData = [
  {
    title: 'For what amount would you like to<br />get the best savings account?',
    description: 'This will allow us to recommend the optimal configuration for<br /> your savings account - you are not committing to anything.',
    type: TypeSlidder,
    data: {
      value: 20000,
      side: 1,
      items: [
        { name: 'Deposit Amount', value: 20000 },
      ],
      max: 40000
    }
  },
  {
    title: 'What is this amount intended for?',
    description: 'Feel free to choose more than one option',
    type: TypeMultiSelect,
    data: {
      items: [
        { name: 'Large Purchase', image: 'type1.svg' },
        { name: 'Waiting to invest', image: 'type2.svg' },
        { name: 'Main residence', image: 'type3.svg' },
        { name: 'Funds for emergencies', image: 'type4.svg' },
        { name: 'Long term saving', image: 'type5.svg' },
        { name: 'Retirement money', image: 'type6.svg' },
        { name: 'Case reserve', image: 'type7.svg' },
        { name: 'Other', text: '?' },
      ]
    }
  },
  {
    title: 'Do you have a specific time frame in<br /> mind for this?',
    descriptionImages: [
      { image: 'type1.svg', description: 'Large purchase' },
    ],
    type: TypeSelect,
    data: {
      items: [
        { id: 1, text: 'Yes, I have a precise time frame in mind' },
        { id: 2, text: 'Yes, I have an approximate idea of the time frame' },
        { id: 3, text: 'No, I’m unsure yet' },
      ]
    }
  },
  {
    title: 'Roughly how much of the total amount<br /> are you planning to use for this?',
    descriptionImages: [
      { image: 'type1.svg', description: 'Large purchase' },
    ],
    type: TypeSlidder,
    data: {
      value: 20000,
      side: 2,
      items: [
        { name: 'Amount Needed' },
        { name: 'Total Pot' },
      ],
      max: 40000
    }
  },
  {
    title: 'Do you know when is the earliest you<br /> expect one of these to take place?',
    descriptionImages: [
      { image: 'type1.svg', description: 'Large purchase' },
      { image: 'type2.svg', description: 'Waiting to invest' }
    ],
    type: TypeSelect,
    data: {
      items: [
        { id: 1, text: 'Yes, I have a precise time frame in mind' },
        { id: 2, text: 'Yes, I have an approximate idea of the time frame' },
        { id: 3, text: 'No, I’m unsure yet' },
      ]
    }
  },
  {
    title: 'What portion of the amount would you<br /> like to have easy access to?',
    description: 'An Easy Access account is an account from which you can<br> immediately withdraw, without costs or penalty to you',
    type: TypeSlidder,
    data: {
      value: 5000,
      side: 2,
      items: [
        { name: 'Easy Access' },
        { name: 'Total Pot' },
      ],
      max: 25000
    }
  },
  {
    title: 'What level of access would you like for your<br /> emergency funds over the next 2 years?',
    description: 'Savings products with easy access to funds tend to attract lower rates of interest.',
    type: TypeSelect,
    data: {
      items: [
        { id: 1, text: 'I need immediate access even if the rate is lower' },
        { id: 2, text: 'Access is my priority, but some restrictions are fine' },
        { id: 3, text: 'I prioritise high interest rates, but might need access' },
      ]
    }
  }
]
