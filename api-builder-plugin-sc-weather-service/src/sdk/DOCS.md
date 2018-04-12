# Registered methods for the Connector
### function `GetCurrentWeatherByCity ( params? : Object )`
> * **Method**: get 
> * **Path**: /weather/current 
> * **Description**: Get the current weather in the specified city. 
> * **Parameters**: 
>   * *city:* The city to query the weather for.
>      * required: true
>      * type: string
>   * *country:* The country the city is in.
>      * required: false
>      * type: string
>   * *units:* The units to use [metric|imperial]. Default: metric
>      * required: false
>      * type: string
>   * *x-request-id:* 
>      * required: false
>      * type: string
>   * *x-b3-traceid:* 
>      * required: false
>      * type: string
>   * *x-b3-spanid:* 
>      * required: false
>      * type: string
>   * *x-b3-parentspanid:* 
>      * required: false
>      * type: string
>   * *x-b3-sampled:* 
>      * required: false
>      * type: string
>   * *x-b3-flags:* 
>      * required: false
>      * type: string
>   * *x-ot-span-context:* 
>      * required: false
>      * type: string

