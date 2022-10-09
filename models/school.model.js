const mongoose = require('mongoose');
const { isEmail } = require('validator');
const schoolSchema = mongoose.Schema({
    schoolName: {
        type: String,
        required: true,
        trim: true        
    },
    founderName: {
        type: String,
        required: true,
        trim: true        
    },
    schoolEmail: {
        type: String,
        validate: [isEmail],
    },
    slogan: {
        type: String,
        required: true,
        trim: true
    },
    logo: {
        type: String
    },
    isDeleted: {
         type: Boolean,
         default: false 
        },
    schoolYear: {
        type: [
            {
                year: Date,
                division:String,
                period: {
                    type: [
                        {
                            starDate: Date,
                            endDate: Date,
                            status: Boolean
                        }

                    ]
                },
                deadline:{
                    type: [
                        {
                            starDate: Date,
                            endDate: Date,
                            price: Number
                        }
                    ]
                }
            }
        ]
    },
    actor: {
        type: [
            {
                role: String,
                actif: Boolean,
                userId: String

            }
        ]
    },
    subscribe: {
        type: [
            {
                regisDate: Date,
                subDate:Date,
                testDate: Date,
                status: Boolean,
                sms: Number,
                whatsapp: Number,
                mail: Number,
                library: Number

            }
        ]

    },
    class: {
        type: [String]
    },
    setting: {
        payment:{
            type: [
                {
                    class: String,
                    feild: {
                        type: 
                            [
                                {
                                    name: String,
                                    price: String
                                }
                            ]                        
                    }

                }

            ]
        }
    }
},
{
    timestamps: true,
}

)


schoolSchema.pre('find', function() {
    this.where({ isDeleted: false });
  });
  
  schoolSchema.pre('findOne', function() {
    this.where({ isDeleted: false });
  });

  schoolSchema.pre('findById', function() {
    this.where({ isDeleted: false });
  });


module.exports = mongoose.model('school', schoolSchema)