function _LoadModel(model)
    while not HasModelLoaded(model) do
        RequestModel(model)
        Wait(1)
    end
end

function stringify(table)
    local res = '{'
    local currentElInd = 0
    local tableLength = getTableLength(table)

    for k, v in pairs(table) do
        -- Add one to get the current index of the element / value
        currentElInd = currentElInd + 1

        -- in case of a record table, show the key
        if (type(k) ~= 'number') then
            res = res .. '[' .. k .. '] = '
        end

        -- add value / array element to result
        if (type(v) == 'table') then
            res = res .. stringify(v)
        else
            res = res .. v
        end

        if (currentElInd ~= tableLength) then -- check if the current element is NOT the last element in the table
            res = res .. ', '
        end
    end

    res = res .. '}'
    return res
end

function getTableLength(table)
    local length = 0
    
    for _ in pairs(table) do
        length = length + 1
    end

    return length
end

function msg(...)
    local msgs = {...}

    for i = 1, #msgs do
        local msgContent = msgs[i]
        TriggerEvent('chat:addMessage', {
            args = {msgContent}
        })
    end

    return
end

function addSuggestion(cmd, ...)
    local paramNames = {...}
    local args = {}

    for i = 1, #paramNames do
        local paramName = paramNames[i]
        local arg = {
            name = paramName
        }
        table.insert(args, arg)
    end

    TriggerEvent('chat:addSuggestion', '/' .. cmd, '', args)
    
    return
end

function convertToRad(angleDeg)
    local angleRad = 90 + angleDeg
    if (angleRad >= 360) then
        angleRad = angleRad - 360
    end
    return math.rad(angleRad)
end

function getDistance(x1, y1, z1, x2, y2, z2)
    local dx = math.abs(x2 - x1)
    local dy = math.abs(y2 - y1)
    local dz = math.abs(z2 - z1)
    return math.sqrt(dx^2 + dy^2 + dz^2)
end