import React from 'react';

export const introduction = {
  title: "Our Beliefs",
  content: "We are a church rooted in historic, biblical Christianity. We hold to the foundational doctrines of the Christian faith and aim to live out what we believe with humility, clarity, and conviction."
};

export const beliefsData = [
  {
    id: 'core-beliefs',
    title: 'Core Doctrinal Beliefs',
    content: (
      <ul className="list-disc pl-6 space-y-4">
        <li><strong>The Bible:</strong> We believe the Bible is the inspired, infallible, and final authority in all matters of life and faith (2 Timothy 3:16–17).</li>
        <li><strong>God:</strong> We believe in one God who exists eternally in three persons: Father, Son, and Holy Spirit (Matthew 28:19).</li>
        <li><strong>Jesus Christ:</strong> We believe Jesus is fully God and fully man, born of a virgin, sinless in life, crucified for our sins, bodily resurrected, and returning again (John 1:1–14; Romans 5:8).</li>
        <li><strong>The Holy Spirit:</strong> We believe the Spirit regenerates, indwells, equips, and empowers believers for godly living and gospel mission (Titus 3:5; Acts 1:8).</li>
        <li><strong>Salvation:</strong> We believe salvation is by grace alone, through faith alone, in Christ alone—not by works (Ephesians 2:8–9).</li>
        <li><strong>The Church:</strong> We believe the Church is the body of Christ and is called to gather, grow, serve, and go make disciples (Acts 2:42–47).</li>
        <li><strong>The Mission:</strong> We believe every believer is called to share the gospel and make disciples of all nations (Matthew 28:18–20).</li>
        <li><strong>The Return of Christ:</strong> We believe Jesus will return personally and visibly to judge the living and the dead and establish His Kingdom (Revelation 22:12).</li>
      </ul>
    ),
  },
  {
    id: 'foundational-scriptures',
    title: 'Foundational Scriptures',
    content: (
       <ul className="list-disc pl-6 space-y-2">
        <li>Matthew 28:18–20</li>
        <li>Acts 2:42–47</li>
        <li>Ephesians 2:8–10</li>
        <li>Romans 1:16</li>
        <li>2 Timothy 3:16–17</li>
        <li>John 14:6</li>
      </ul>
    )
  },
];

export const statementOfFaithNote = {
  content: "A full Statement of Faith is available upon request."
}; 