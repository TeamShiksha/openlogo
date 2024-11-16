// eslint-disable-next-line no-unused-vars
import React from 'react'
import styles from "./Pricing.module.css"
import PricingCard from './PricingCard'

function Pricing() {

  let plans = [
    {
      'index': 0,
      'name': 'Basic plan',
      'pricing': 10,
      'tagline': 'Ideal for small teams and startups.',
      'keypoints': [
        'Fortune 500 company logo',
        '500 API calls per month',
        '2 API keys',
        'Basic analytics',
        '48-72 hour of response time'
      ]
    },
    {
      'index': 1,
      'name': 'Business plan',
      'pricing': 20,
      'tagline': 'Growing teams up to 20 users.',
      'keypoints': [
        'Fortune 500 company logo + private images',
        '10000 API calls per month',
        '5 API keys',
        'Advance analytics',
        '12-36 hours of response time'
      ]
    },
    {
      'index': 2,
      'name': 'Enterprise plan',
      'pricing': 40,
      'tagline': 'Large teams with unlimited users.',
      'keypoints': [
        'Fortune 500 company logo + unlimited private logos',
        'Unlimited API calls per month',
        '50 API keys',
        'Advance analytics',
        'Priority support'
      ]
    }
  ]

  return (
    <div className={styles.mainDiv}>
      <div>
        <h1 className={styles.heading}>Compare our plans and find yours</h1>
        <p className={styles.tagline}>Simple, transparent pricing that grows with you. Try any plan free for 30 days.</p>
      </div>

      <div className={styles.cardsDiv}>
        {plans.map((plan, index)=>{
          console.log(plan.name)
          return <PricingCard key={index} name={plan.name} pricing= {plan.pricing} tagline={plan.tagline} index={plan.index} keypoints={plan.keypoints}/>
        })}
      </div>
    </div>
  )
}

export default Pricing
